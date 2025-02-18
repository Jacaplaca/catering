import getLowerCaseSort from '@root/app/lib/lower-case-sort-pipeline';
import { getQueryOrder, getQueryPagination } from '@root/app/lib/safeDbQuery';
import getConsumerDbQuery from '@root/app/server/api/routers/specific/libs/getConsumersDbQuery';
import { options } from '@root/app/server/api/specific/aggregate';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { db } from '@root/app/server/db';
import { consumerEditValidator, deleteConsumersValid, getConsumerValid, getConsumersCountValid, getConsumersValid, getDietaryAllForClientValid } from '@root/app/validators/specific/consumer';
import { type ConsumerCustomTable, consumersSortNames } from '@root/types/specific';
import { OrderStatus, RoleType } from '@prisma/client';

const dietaryAll = createCateringProcedure([RoleType.client])
    .input(getDietaryAllForClientValid)
    .query(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { clientId } = input;

        const allowedSortNames = consumersSortNames;

        const orderBy = getQueryOrder({
            name: 'name',
            direction: 'asc',
            allowedNames: allowedSortNames,
            inNumbers: true
        });

        return await db.consumer.aggregateRaw({
            pipeline: [
                ...getConsumerDbQuery({
                    withDiet: true,
                    showColumns: ['name', 'code']
                    , catering, clientId, withNameOnly: true, isClient: true, onlyActiveConsumer: true
                }),
                ...getLowerCaseSort(orderBy),
            ],
            options
        }) as unknown as (ConsumerCustomTable & { name: string })[];

    });

const getMany = createCateringProcedure([RoleType.manager, RoleType.dietician, RoleType.client])
    .input(getConsumersValid)
    .query(({ input, ctx }) => {
        const { session: { catering, user } } = ctx;
        const { page, limit, sortName, sortDirection, customerSearchValue, dietSearchValue, showColumns, clientId, clientPlaceId } = input;

        const pagination = getQueryPagination({ page, limit });

        const allowedSortNames = consumersSortNames;

        const orderBy = getQueryOrder({
            name: sortName,
            direction: sortDirection,
            allowedNames: allowedSortNames,
            inNumbers: true
        });

        const jobId = clientPlaceId;
        const isClient = user.roleId === RoleType.client;

        const pipeline = [
            ...getConsumerDbQuery({ customerSearchValue, dietSearchValue, showColumns, catering, clientId: jobId ? jobId : clientId, isClient }),
            ...getLowerCaseSort(orderBy),
            { $skip: pagination.skip },
            { $limit: pagination.take },
        ]

        return db.consumer.aggregateRaw({
            pipeline,
            options
        }) as unknown as ConsumerCustomTable[];
    });

const count = createCateringProcedure([RoleType.manager, RoleType.dietician, RoleType.client])
    .input(getConsumersCountValid)
    .query(async ({ input, ctx }) => {
        const { session: { catering, user } } = ctx;
        const { customerSearchValue, dietSearchValue, showColumns, clientId, clientPlaceId } = input;

        const isClient = user.roleId === RoleType.client;

        const jobId = clientPlaceId;

        const count = await db.consumer.aggregateRaw({
            pipeline: [
                ...getConsumerDbQuery({ customerSearchValue, dietSearchValue, showColumns, catering, clientId: jobId ? jobId : clientId, isClient }),
                { $count: 'count' },
            ]
        }) as unknown as { count: number }[];
        return count[0]?.count ?? 0;
    });

const getOne = createCateringProcedure([RoleType.dietician, RoleType.client, RoleType.manager])
    .input(getConsumerValid)
    .query(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { id } = input;

        const clients = await db.consumer.aggregateRaw({
            pipeline: getConsumerDbQuery({ id, catering })
        }) as unknown as ConsumerCustomTable[];
        return clients[0];
    });

const addOne = createCateringProcedure([RoleType.dietician, RoleType.manager])
    .input(consumerEditValidator)
    .mutation(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { name, client, notes, diet, code } = input;
        const cateringId = catering.id;

        const goodCode = code.trim().toUpperCase();

        const clientWithCode = await db.consumer.findFirst({
            where: {
                cateringId,
                code: goodCode
            }
        });

        if (clientWithCode) {
            throw new Error("consumers:duplicate_code_error");
        }


        return db.consumer.create({
            data: {
                code: goodCode,
                name,
                cateringId,
                clientId: client.id,
                notes,
                dieticianId: ctx.session.user.id,
                diet
            }
        });

        // return handleDiet({
        //     diet,
        //     userId: ctx.session.user.id,
        //     roleId: ctx.session.user.roleId,
        //     consumer: newConsumer
        // })
    });


const edit = createCateringProcedure([RoleType.dietician, RoleType.manager])
    .input(consumerEditValidator)
    .mutation(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { id, name, client, notes, diet, code } = input;

        const goodCode = code.trim().toUpperCase();

        const consumerWithCode = await db.consumer.findFirst({
            where: {
                cateringId: catering.id,
                code: goodCode,
                id: {
                    not: id
                }
            }
        });

        if (consumerWithCode) {
            throw new Error("consumers:duplicate_code_error");
        }

        return await db.consumer.update({
            where: { id },
            data: {
                name,
                code: goodCode,
                clientId: client.id,
                cateringId: catering.id,
                notes,
                diet
            }
        });

        // return handleDiet({
        //     diet,
        //     userId: ctx.session.user.id,
        //     roleId: ctx.session.user.roleId,
        //     consumer: updatedConsumer
        // })
    });

async function beenInOrder(ids: string[]): Promise<Record<string, boolean>> {
    const result: Record<string, boolean> = {};

    await Promise.all(
        ids.map(async (consumerId) => {
            const [
                breakfastOrder,
                lunchOrder,
                dinnerOrder,
                lunchBeforeDeadlineOrder,
                dinnerBeforeDeadlineOrder,
            ] = await Promise.all([
                db.orderConsumerBreakfast.findFirst({ where: { consumerId } }),
                db.orderConsumerLunch.findFirst({ where: { consumerId } }),
                db.orderConsumerDinner.findFirst({ where: { consumerId } }),
                db.orderConsumerLunchBeforeDeadline.findFirst({ where: { consumerId } }),
                db.orderConsumerDinnerBeforeDeadline.findFirst({ where: { consumerId } }),
            ]);

            result[consumerId] = Boolean(
                breakfastOrder ??
                lunchOrder ??
                dinnerOrder ??
                lunchBeforeDeadlineOrder ??
                dinnerBeforeDeadlineOrder
            );
        })
    );

    return result;
}

// Updated deleteOne procedure that checks deletion possibility for each consumer
const deleteOne = createCateringProcedure([RoleType.dietician, RoleType.manager])
    .input(deleteConsumersValid)
    .mutation(async ({ input, ctx }) => {
        const { ids } = input;
        const { session: { catering } } = ctx;
        const cateringId = catering.id;

        // Function that fetches order ids with 'draft' status which include consumers from the given list.
        async function getDraftOrdersWithConsumers(consumerIds: string[], cateringId: string): Promise<string[]> {
            const orders = await db.order.findMany({
                where: {
                    cateringId,
                    status: OrderStatus.draft,
                    OR: [
                        { breakfastDiet: { some: { consumerId: { in: consumerIds } } } },
                        { lunchDiet: { some: { consumerId: { in: consumerIds } } } },
                        { dinnerDiet: { some: { consumerId: { in: consumerIds } } } },
                        { lunchDietBeforeDeadline: { some: { consumerId: { in: consumerIds } } } },
                        { dinnerDietBeforeDeadline: { some: { consumerId: { in: consumerIds } } } },
                    ]
                },
                select: { id: true }
            });
            return orders.map(order => order.id);
        }

        const deactivateMap = await beenInOrder(ids);
        const forDeactivate = Object.keys(deactivateMap).filter(id => deactivateMap[id]);
        const forDelete = Object.keys(deactivateMap).filter(id => !deactivateMap[id]);

        // Retrieve IDs of draft orders that include the consumers to be deactivated.
        const draftOrderIds = await getDraftOrdersWithConsumers(forDeactivate, cateringId);

        // Remove the consumers from the draft orders (delete join table records)
        await Promise.all([
            db.orderConsumerBreakfast.deleteMany({
                where: {
                    orderId: { in: draftOrderIds },
                    consumerId: { in: forDeactivate }
                }
            }),
            db.orderConsumerLunch.deleteMany({
                where: {
                    orderId: { in: draftOrderIds },
                    consumerId: { in: forDeactivate }
                }
            }),
            db.orderConsumerDinner.deleteMany({
                where: {
                    orderId: { in: draftOrderIds },
                    consumerId: { in: forDeactivate }
                }
            }),
            db.orderConsumerLunchBeforeDeadline.deleteMany({
                where: {
                    orderId: { in: draftOrderIds },
                    consumerId: { in: forDeactivate }
                }
            }),
            db.orderConsumerDinnerBeforeDeadline.deleteMany({
                where: {
                    orderId: { in: draftOrderIds },
                    consumerId: { in: forDeactivate }
                }
            }),
        ]);

        // Update order counts after removing consumers from draft orders.
        // For each order we count remaining join records and update the corresponding fields.
        for (const orderId of draftOrderIds) {
            const newBreakfastDietCount = await db.orderConsumerBreakfast.count({ where: { orderId } });
            const newLunchDietCount = await db.orderConsumerLunch.count({ where: { orderId } });
            const newDinnerDietCount = await db.orderConsumerDinner.count({ where: { orderId } });
            const newLunchDietCountBeforeDeadline = await db.orderConsumerLunchBeforeDeadline.count({ where: { orderId } });
            const newDinnerDietCountBeforeDeadline = await db.orderConsumerDinnerBeforeDeadline.count({ where: { orderId } });

            await db.order.update({
                where: { id: orderId },
                data: {
                    breakfastDietCount: newBreakfastDietCount,
                    lunchDietCount: newLunchDietCount,
                    dinnerDietCount: newDinnerDietCount,
                    lunchDietCountBeforeDeadline: newLunchDietCountBeforeDeadline,
                    dinnerDietCountBeforeDeadline: newDinnerDietCountBeforeDeadline,
                },
            });
        }

        await db.consumer.updateMany({
            where: { id: { in: forDeactivate }, cateringId },
            data: { deactivated: true }
        });

        await db.consumer.deleteMany({
            where: { id: { in: forDelete }, cateringId }
        });

        return { deactivateMap, draftOrderIds };
    });

const consumerRouter = {
    // getInfinite,
    getMany,
    count,
    getOne,
    addOne,
    edit,
    deleteOne,
    dietaryAll,
};

export default consumerRouter;
