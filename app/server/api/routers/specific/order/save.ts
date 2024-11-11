import { OrderStatus } from '@prisma/client';
import getJobId from '@root/app/server/api/routers/specific/libs/getJobId';
import { orderValidator } from '@root/app/validators/specific/order';
import { type z } from 'zod';
import { type Context, createCateringProcedure } from '@root/app/server/api/specific/trpc';
import getDeadlinesStatus from '@root/app/specific/lib/getDeadlinesStatus';

const save = async ({ ctx, input, status }: {
    ctx: Context,
    input: z.infer<typeof orderValidator> & { id?: string },
    status: OrderStatus
}) => {
    const { db, session } = ctx;

    const { catering, user } = session;
    const { day, diet, standards } = input;

    const jobId = await getJobId({
        userId: user.id,
        cateringId: catering.id,
        roleId: user.roleId
    });

    if (!jobId) {
        throw new Error("shared:cant_find_user");
    }

    // const client = await db.client.findUnique({
    //     where: {
    //         id: jobId,
    //     }
    // });

    // const time = client?.settings.lastOrderTime ?? catering.settings.lastOrderTime;
    // const timeZone = catering.settings.timeZone;
    // const deadline = { time, timeZone };

    const {
        first: firstDeadline,
        isBeforeFirst,
        isBetween,
        isAfterSecond,
    } = getDeadlinesStatus({ settings: catering.settings, day });

    if (firstDeadline.isNonWorkingDay) {
        throw new Error("orders:non_working_day");
    }

    if (isAfterSecond) {
        throw new Error("orders:deadline_is_over");
    }

    const existingOrder = await db.order.findFirst({
        where: input.id ? {
            id: input.id,
        } : {
            cateringId: catering.id,
            clientId: jobId,

            deliveryDay: {
                equals: day,
            },
        },
        include: {
            dinnerDietBeforeDeadline: true,
            lunchDietBeforeDeadline: true,
        },
    });

    const orderPlaceData = {
        cateringId: catering.id,
        clientId: jobId,
        deliveryDay: day,
    }

    const breakfastDiets = diet.breakfast.map(consumerId => ({ consumerId }))
    const lunchDiets = diet.lunch.map(consumerId => ({ consumerId }))
    const dinnerDiets = diet.dinner.map(consumerId => ({ consumerId }))

    const orderUpdateData = {
        status,
        breakfastStandard: standards.breakfast,
        lunchStandard: standards.lunch,
        dinnerStandard: standards.dinner,
        breakfastDiet: {
            create: breakfastDiets
        },
        breakfastDietCount: breakfastDiets.length,
        lunchDiet: {
            create: lunchDiets
        },
        lunchDietCount: lunchDiets.length,
        dinnerDiet: {
            create: dinnerDiets
        },
        dinnerDietCount: dinnerDiets.length,
        sentToCateringAt: status === OrderStatus.in_progress ? new Date() : undefined,
    }

    const beforeFirstDeadlineUpdateData = {
        lunchStandardBeforeDeadline: standards.lunch,
        dinnerStandardBeforeDeadline: standards.dinner,
        lunchDietBeforeDeadline: {
            create: lunchDiets
        },
        dinnerDietBeforeDeadline: {
            create: dinnerDiets
        },
        lunchDietCountBeforeDeadline: lunchDiets.length,
        dinnerDietCountBeforeDeadline: dinnerDiets.length,
    }

    if (existingOrder) {
        if (existingOrder.status !== OrderStatus.draft && status === OrderStatus.draft) {
            throw new Error("orders:order_not_in_draft");
        }
        const transaction = [
            db.orderConsumerLunch.deleteMany({ where: { orderId: existingOrder.id } }),
            db.orderConsumerDinner.deleteMany({ where: { orderId: existingOrder.id } }),
        ]

        if (isBeforeFirst) {
            transaction.push(db.orderConsumerBreakfast.deleteMany({ where: { orderId: existingOrder.id } }));
            transaction.push(db.orderConsumerDinnerBeforeDeadline.deleteMany({ where: { orderId: existingOrder.id } }));
            transaction.push(db.orderConsumerLunchBeforeDeadline.deleteMany({ where: { orderId: existingOrder.id } }));
        }

        await db.$transaction(transaction);

        let data = {}

        if (isBeforeFirst) {
            data = { ...orderUpdateData, ...beforeFirstDeadlineUpdateData }
        } else if (isBetween) {
            const filterDiets = (
                newDiets: { consumerId: string }[],
                existingDiets: { consumerId: string }[]
            ) => {
                const filteredDiets = newDiets.filter(diet =>
                    existingDiets.some(existingDiet => existingDiet.consumerId === diet.consumerId)
                );
                return filteredDiets
            };

            const newDietLunches = filterDiets(lunchDiets, existingOrder.lunchDietBeforeDeadline ?? []);
            const newDietDinners = filterDiets(dinnerDiets, existingOrder.dinnerDietBeforeDeadline ?? []);

            const betweenDeadlineUpdateData = {
                breakfastStandard: existingOrder.breakfastStandard,
                lunchStandard: standards.lunch,
                dinnerStandard: standards.dinner,
                lunchDiet: {
                    create: newDietLunches
                },
                lunchDietCount: newDietLunches.length,
                dinnerDiet: {
                    create: newDietDinners
                },
                dinnerDietCount: newDietDinners.length,

            }

            data = { ...orderUpdateData, ...betweenDeadlineUpdateData }
        } else {
            data = orderUpdateData
        }

        return db.order.update({
            where: { id: existingOrder.id },
            data,
        });
    } else {
        return db.order.create({
            data: { ...orderPlaceData, ...orderUpdateData, ...beforeFirstDeadlineUpdateData },
        });
    }
}

export const place = createCateringProcedure('client')
    .input(orderValidator)
    .mutation(async ({ ctx, input }) => {
        // await new Promise(resolve => setTimeout(resolve, 1000));
        return save({ ctx, input, status: OrderStatus.in_progress })
    })

export const saveDraft = createCateringProcedure('client')
    .input(orderValidator)
    .mutation(async ({ ctx, input }) => {
        // await new Promise(resolve => setTimeout(resolve, 1000));
        return save({ ctx, input, status: OrderStatus.draft })

    })

const saveObject = {
    saveDraft,
    place,
}

export default saveObject;
