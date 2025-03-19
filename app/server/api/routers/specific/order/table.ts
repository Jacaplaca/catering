import { db } from '@root/app/server/db';
import { getQueryOrder, getQueryPagination } from '@root/app/lib/safeDbQuery';
import getOrderDbQuery from '@root/app/server/api/routers/specific/libs/getOrdersDbQuery';
import { getOrdersCountValid, getOrdersValid } from '@root/app/validators/specific/order';
import { type OrdersCustomTable, ordersSortNames } from '@root/types/specific';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { options } from '@root/app/server/api/specific/aggregate';
import { RoleType, type Prisma } from '@prisma/client';

const table = createCateringProcedure([RoleType.manager, RoleType.kitchen, RoleType.client, RoleType.dietician])
    .input(getOrdersValid)
    .query(({ input, ctx }) => {
        const { session: { catering, user } } = ctx;
        const { page, limit, sortName, sortDirection, searchValue, showColumns, clientId, status, tagId } = input;

        const pagination = getQueryPagination({ page, limit });

        const allowedSortNames = ordersSortNames;

        const orderBy = getQueryOrder({
            name: sortName,
            direction: sortDirection,
            allowedNames: allowedSortNames,
            inNumbers: true
        });

        let additionalPipeline: Prisma.InputJsonValue[] = [];

        if (sortName === 'deliveryDay') {
            additionalPipeline = [
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
                }
            ];
        }

        const jobId = user.roleId === RoleType.client ? clientId : undefined;

        const pipeline = [
            ...getOrderDbQuery({
                searchValue,
                showColumns,
                catering,
                clientId: jobId ? jobId : clientId,
                roleId: user.roleId,
                status,
                tagId
            }),
            ...(sortName === 'deliveryDay' ? additionalPipeline : [{ $sort: orderBy }]),
            { $skip: pagination.skip },
            { $limit: pagination.take },
        ]

        return db.order.aggregateRaw({
            pipeline,
            options
        }) as unknown as OrdersCustomTable[];
    });

const count = createCateringProcedure([RoleType.manager, RoleType.kitchen, RoleType.client, RoleType.dietician])
    .input(getOrdersCountValid)
    .query(async ({ input, ctx }) => {
        const { session: { catering, user } } = ctx;
        const { searchValue, showColumns, clientId, status, tagId } = input;

        const jobId = user.roleId === RoleType.client ? clientId : undefined;

        const count = await db.order.aggregateRaw({
            pipeline: [
                ...getOrderDbQuery({
                    searchValue,
                    showColumns,
                    catering,
                    clientId: jobId ? jobId : clientId,
                    roleId: user.roleId,
                    status,
                    tagId
                }),
                { $count: 'count' },
            ]
        }) as unknown as { count: number }[];
        return count[0]?.count ?? 0;
    });

const getTable = {
    table,
    count,
};


export default getTable;
