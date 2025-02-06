import { db } from '@root/app/server/db';
import { getQueryPagination } from '@root/app/lib/safeDbQuery';
import { getDayValid, getOrdersGroupedByDayValid } from '@root/app/validators/specific/order';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import type { OrderGroupedByDayCustomTable, OrderMealPopulated } from '@root/types/specific';
import { RoleType, type Client, type OrderConsumerBreakfast, type OrderConsumerDinner, type OrderConsumerLunch, type OrderStatus } from '@prisma/client';
import processMeals from '@root/app/server/api/routers/specific/libs/processMeals';

const day = createCateringProcedure([RoleType.manager, RoleType.kitchen])
    .input(getDayValid)
    .query(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { dayId } = input;

        const [year, month, day] = dayId.split('-').map(Number);

        const dayData = await db.order.aggregateRaw({
            pipeline: [
                {
                    $match: {
                        cateringId: catering.id,
                        status: { $ne: 'draft' },
                        deliveryDay: {
                            year,
                            month,
                            day
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'Client',
                        localField: 'clientId',
                        foreignField: '_id',
                        as: 'client'
                    }
                },
                {
                    $unwind: '$client'
                },
                {
                    $lookup: {
                        from: 'OrderConsumerBreakfast',
                        let: { orderId: '$_id' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$orderId', '$$orderId'] } } },
                            {
                                $lookup: {
                                    from: 'Consumer',
                                    localField: 'consumerId',
                                    foreignField: '_id',
                                    as: 'consumer'
                                }
                            },
                            { $unwind: '$consumer' }
                        ],
                        as: 'breakfastDiet'
                    }
                },
                {
                    $lookup: {
                        from: 'OrderConsumerLunch',
                        let: { orderId: '$_id' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$orderId', '$$orderId'] } } },
                            {
                                $lookup: {
                                    from: 'Consumer',
                                    localField: 'consumerId',
                                    foreignField: '_id',
                                    as: 'consumer'
                                }
                            },
                            { $unwind: '$consumer' }
                        ],
                        as: 'lunchDiet'
                    }
                },
                {
                    $lookup: {
                        from: 'OrderConsumerDinner',
                        let: { orderId: '$_id' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$orderId', '$$orderId'] } } },
                            {
                                $lookup: {
                                    from: 'Consumer',
                                    localField: 'consumerId',
                                    foreignField: '_id',
                                    as: 'consumer'
                                }
                            },
                            { $unwind: '$consumer' }
                        ],
                        as: 'dinnerDiet'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        cateringId: 1,
                        clientId: 1,
                        client: 1,
                        status: 1,
                        breakfastStandard: 1,
                        lunchStandard: 1,
                        dinnerStandard: 1,
                        breakfastDietCount: 1,
                        lunchDietCount: 1,
                        dinnerDietCount: 1,
                        breakfastDiet: 1,
                        lunchDiet: 1,
                        dinnerDiet: 1,
                        deliveryDay: 1,
                        sentToCateringAt: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]
        }) as unknown as {
            _id: string;
            client: Client;
            status: OrderStatus;
            sentToCateringAt: { $date: Date };
            breakfastStandard: number;
            lunchStandard: number;
            dinnerStandard: number;
            breakfastDiet: (OrderConsumerBreakfast & OrderMealPopulated)[];
            lunchDiet: (OrderConsumerLunch & OrderMealPopulated)[];
            dinnerDiet: (OrderConsumerDinner & OrderMealPopulated)[];
        }[]

        const summary = dayData.reduce((acc, {
            breakfastStandard,
            lunchStandard,
            dinnerStandard,
        }) => {
            acc.breakfastStandard += breakfastStandard;
            acc.lunchStandard += lunchStandard;
            acc.dinnerStandard += dinnerStandard;
            return acc;
        }, {
            breakfastStandard: 0,
            lunchStandard: 0,
            dinnerStandard: 0,
        })

        const standard = dayData.reduce((acc, order) => {
            const code = order.client?.info?.code;
            if (code) {
                acc.breakfast[code] = (acc.breakfast[code] ?? 0) + (order.breakfastStandard ?? 0);
                acc.lunch[code] = (acc.lunch[code] ?? 0) + (order.lunchStandard ?? 0);
                acc.dinner[code] = (acc.dinner[code] ?? 0) + (order.dinnerStandard ?? 0);
            }
            return acc;
        }, {
            breakfast: {} as Record<string, number>,
            lunch: {} as Record<string, number>,
            dinner: {} as Record<string, number>,
        })

        const diet = dayData.reduce((acc, {
            client,
            breakfastDiet,
            lunchDiet,
            dinnerDiet,
        }) => {



            const code = client?.info?.code;
            if (code) {
                acc.breakfast[code] = processMeals(breakfastDiet);
                acc.lunch[code] = processMeals(lunchDiet);
                acc.dinner[code] = processMeals(dinnerDiet);
            }
            return acc;
        }, {
            breakfast: {} as Record<string, Record<string, { code: string, description: string }>>,
            lunch: {} as Record<string, Record<string, { code: string, description: string }>>,
            dinner: {} as Record<string, Record<string, { code: string, description: string }>>,
        })


        const dayDataCleaned = dayData.map(({
            breakfastDiet: _breakfastDiet,
            lunchDiet: _lunchDiet,
            dinnerDiet: _dinnerDiet,
            ...rest
        }) => rest);

        return { dayData: dayDataCleaned, summary, standard, diet };
    });

const table = createCateringProcedure([RoleType.manager, RoleType.kitchen])
    .input(getOrdersGroupedByDayValid)
    .query(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { page, limit, sortDirection } = input;

        const pagination = getQueryPagination({ page, limit });


        const groupedOrders = await db.order.aggregateRaw({
            pipeline: [
                {
                    $match: {
                        cateringId: catering.id,
                        status: { $ne: 'draft' }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: '$deliveryDay.year',
                            month: '$deliveryDay.month',
                            day: '$deliveryDay.day'
                        },
                        breakfastStandard: { $sum: '$breakfastStandard' },
                        lunchStandard: { $sum: '$lunchStandard' },
                        dinnerStandard: { $sum: '$dinnerStandard' },
                        breakfastDietCount: { $sum: '$breakfastDietCount' },
                        lunchDietCount: { $sum: '$lunchDietCount' },
                        dinnerDietCount: { $sum: '$dinnerDietCount' },
                        lunchStandardBeforeDeadline: { $sum: '$lunchStandardBeforeDeadline' },
                        dinnerStandardBeforeDeadline: { $sum: '$dinnerStandardBeforeDeadline' },
                        lunchDietCountBeforeDeadline: { $sum: '$lunchDietCountBeforeDeadline' },
                        dinnerDietCountBeforeDeadline: { $sum: '$dinnerDietCountBeforeDeadline' },
                        sentToCateringAt: { $max: '$sentToCateringAt' }
                    }
                },
                {
                    $addFields: {
                        id: {
                            $concat: [
                                { $toString: "$_id.year" },
                                "-",
                                { $toString: "$_id.month" },
                                "-",
                                { $toString: "$_id.day" }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        deliveryDay: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day'
                        },
                        breakfastStandard: 1,
                        lunchStandard: 1,
                        dinnerStandard: 1,
                        breakfastDietCount: 1,
                        lunchDietCount: 1,
                        dinnerDietCount: 1,
                        lunchStandardBeforeDeadline: 1,
                        dinnerStandardBeforeDeadline: 1,
                        lunchDietCountBeforeDeadline: 1,
                        dinnerDietCountBeforeDeadline: 1,
                        sentToCateringAt: 1
                    }
                },
                {
                    $addFields: {
                        sortDate: {
                            $dateFromParts: {
                                year: "$deliveryDay.year",
                                month: "$deliveryDay.month",
                                day: "$deliveryDay.day"
                            }
                        }
                    }
                },
                {
                    $sort: {
                        sortDate: sortDirection === 'asc' ? 1 : -1
                    }
                },
                {
                    $project: {
                        sortDate: 0
                    }
                },
                { $skip: pagination.skip },
                { $limit: pagination.take }
            ]
        });

        return groupedOrders as unknown as OrderGroupedByDayCustomTable[];
    });

const count = createCateringProcedure([RoleType.manager, RoleType.kitchen])
    .query(async ({ ctx }) => {
        const { session: { catering } } = ctx;

        const result = await db.order.aggregateRaw({
            pipeline: [
                {
                    $match: {
                        cateringId: catering.id,
                        status: { $ne: 'draft' }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: '$deliveryDay.year',
                            month: '$deliveryDay.month',
                            day: '$deliveryDay.day'
                        }
                    }
                },
                {
                    $count: 'count'
                }
            ]
        }) as unknown as { count: number }[];

        return result[0]?.count ?? 0;
    });

const getTable = {
    day,
    table,
    count,
};


export default getTable;