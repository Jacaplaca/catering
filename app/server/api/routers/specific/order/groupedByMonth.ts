import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { RoleType } from '@prisma/client';
import { db } from '@root/app/server/db';
import { monthListValid } from '@root/app/validators/specific/order';
import getLowerCaseSort from '@root/app/lib/lower-case-sort-pipeline';
import { type ClientCustomTable } from '@root/types/specific';
import { getQueryOrder, getQueryPagination } from '@root/app/lib/safeDbQuery';
import { ordersGroupedByMonthSortNames } from '@root/types/specific';
import { options } from '@root/app/server/api/specific/aggregate';

const getOrdersDbQuery = (clientId: string) => {
    return [
        { $match: { clientId } },
        {
            $group: {
                _id: {
                    year: "$deliveryDay.year",
                    month: "$deliveryDay.month"
                },
                // Sum all meals
                totalBreakfastStandard: { $sum: "$breakfastStandard" },
                totalBreakfastDietCount: { $sum: "$breakfastDietCount" },
                totalLunchStandard: { $sum: "$lunchStandard" },
                totalLunchDietCount: { $sum: "$lunchDietCount" },
                totalDinnerStandard: { $sum: "$dinnerStandard" },
                totalDinnerDietCount: { $sum: "$dinnerDietCount" },
                // Sum meals before deadline
                totalLunchStandardBeforeDeadline: { $sum: "$lunchStandardBeforeDeadline" },
                totalLunchDietCountBeforeDeadline: { $sum: "$lunchDietCountBeforeDeadline" },
                totalDinnerStandardBeforeDeadline: { $sum: "$dinnerStandardBeforeDeadline" },
                totalDinnerDietCountBeforeDeadline: { $sum: "$dinnerDietCountBeforeDeadline" },
                // Add formatted ID for month (YYYY-MM)
                monthId: {
                    $concat: [
                        { $toString: "$deliveryDay.year" },
                        "-",
                        {
                            $cond: {
                                if: { $lt: ["$deliveryDay.month", 9] },
                                then: { $concat: ["0", { $toString: { $add: ["$deliveryDay.month", 1] } }] },
                                else: { $toString: { $add: ["$deliveryDay.month", 1] } }
                            }
                        }
                    ]
                },
                // Keep original orders array if needed
                orders: { $push: "$$ROOT" }
            }
        }
    ]
}


const monthList = createCateringProcedure([RoleType.client])

    .input(monthListValid)
    .query(({ ctx, input }) => {
        const { session: { catering } } = ctx;
        const { clientId, limit, page, sortName, sortDirection } = input;

        if (!clientId) {
            throw new Error("Brak ID klienta");
        }

        const pagination = getQueryPagination({ page, limit });

        const allowedSortNames = ordersGroupedByMonthSortNames;


        const orderBy = getQueryOrder({
            name: sortName,
            direction: sortDirection,
            allowedNames: allowedSortNames,
            inNumbers: true
        });

        const pipeline = [
            ...getOrdersDbQuery(clientId),
            ...getLowerCaseSort(orderBy),
            { $skip: pagination.skip },
            { $limit: pagination.take },
        ]

        return db.order.aggregateRaw({
            pipeline,
            options
        }) as unknown as ClientCustomTable[];
    })


const groupedByMonth = {
    monthList,
}


export default groupedByMonth;
