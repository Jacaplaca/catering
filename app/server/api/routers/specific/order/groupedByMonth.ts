import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { RoleType } from '@prisma/client';
import { db } from '@root/app/server/db';
import { monthCountForClientValid, monthDataForClientValid, monthForClientValid } from '@root/app/validators/specific/order';
import getLowerCaseSort from '@root/app/lib/lower-case-sort-pipeline';
import { type OrderGroupedByMonthCustomTable } from '@root/types/specific';
import { getQueryOrder, getQueryPagination } from '@root/app/lib/safeDbQuery';
import { ordersGroupedByMonthSortNames } from '@root/types/specific';
import { options } from '@root/app/server/api/specific/aggregate';
import getClientMonthsDbQuery from '@root/app/server/api/routers/specific/libs/getClientMonthsDbQuery';
import getConsumersMonthReport from '@root/app/server/api/routers/specific/libs/getConsumersMonthReport';


const getClientId = async ({ doerId, doerRole, clientId, cateringId }: { doerId: string, doerRole: RoleType, clientId?: string, cateringId: string }) => {
    if (doerRole === RoleType.client) {
        if (!clientId) {
            throw new Error("Brak ID klienta");
        }

        const client = await db.client.findUnique({
            where: {
                id: clientId,
                cateringId,
                userId: doerId
            }
        })

        if (!client) {
            throw new Error("Brak klienta");
        }

        return client.id;
    }

    if (!clientId) {
        throw new Error("Brak ID klienta");
    }

    const client = await db.client.findUnique({
        where: {
            id: clientId,
            cateringId
        }
    })

    if (!client) {
        throw new Error("Brak klienta");
    }

    return client.id;
}

const getClientMonthsCountDbQuery = (clientId: string) => {
    return [
        { $match: { clientId } },
        {
            $group: {
                _id: {
                    year: "$deliveryDay.year",
                    month: "$deliveryDay.month"
                }
            }
        },
        { $count: "count" }
    ];
}

const countForClient = createCateringProcedure([RoleType.client])
    .input(monthCountForClientValid)
    .query(async ({ ctx, input }) => {
        const { session: { catering } } = ctx;
        const { clientId } = input;

        const goodClientId = await getClientId({
            doerId: ctx.session.user.id,
            doerRole: ctx.session.user.roleId,
            clientId,
            cateringId: catering.id
        });

        const pipeline = getClientMonthsCountDbQuery(goodClientId);
        const result = await db.order.aggregateRaw({
            pipeline,
            options
        }) as unknown as { count: number }[];

        return result[0]?.count ?? 0;
    });

const tableForClient = createCateringProcedure([RoleType.client])

    .input(monthDataForClientValid)
    .query(async ({ ctx, input }) => {
        const { session: { catering } } = ctx;
        const { clientId, limit, page, sortName, sortDirection } = input;

        const goodClientId = await getClientId({ doerId: ctx.session.user.id, doerRole: ctx.session.user.roleId, clientId, cateringId: catering.id });

        const pagination = getQueryPagination({ page, limit });

        const allowedSortNames = ordersGroupedByMonthSortNames;


        const orderBy = getQueryOrder({
            name: sortName,
            direction: sortDirection,
            allowedNames: allowedSortNames,
            inNumbers: true
        });

        const pipeline = [
            ...getClientMonthsDbQuery(goodClientId),
            ...getLowerCaseSort(orderBy),
            { $skip: pagination.skip },
            { $limit: pagination.take },
        ]

        return db.order.aggregateRaw({
            pipeline,
            options
        }) as unknown as OrderGroupedByMonthCustomTable[];
    })

/**
 * Validates the deliveryMonth string and returns a tuple [year, month].
 *
 * @param deliveryMonth - the input month string in format "YYYY-MM"
 * @returns [year, month]
 * @throws Error if the format is invalid
 */
function validateDeliveryMonth(deliveryMonth: string): [number, number] {
    const parts = deliveryMonth.split('-');
    if (parts.length !== 2) {
        throw new Error('Invalid deliveryMonth format: expected format "YYYY-MM"');
    }
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    if (!Number.isInteger(year) || !Number.isInteger(month)) {
        throw new Error('Invalid deliveryMonth: year and month must be valid integer numbers');
    }
    if (month < 1 || month > 12) {
        throw new Error('Invalid deliveryMonth: month must be between 1 and 12');
    }
    return [year, month];
}

const monthForClient = createCateringProcedure([RoleType.client])
    .input(monthForClientValid)
    .query(async ({ ctx, input }) => {
        const { session: { catering } } = ctx;
        const { deliveryMonth, clientId } = input;

        const goodClientId = await getClientId({
            doerId: ctx.session.user.id,
            doerRole: ctx.session.user.roleId,
            clientId,
            cateringId: catering.id
        });

        const [year, monthHuman] = validateDeliveryMonth(deliveryMonth);

        const pipeline = [
            ...getClientMonthsDbQuery(goodClientId, { year, month: monthHuman }),
        ]

        const result = await db.order.aggregateRaw({
            pipeline,
            options
        }) as unknown as (OrderGroupedByMonthCustomTable & {
            orders:
            {
                breakfastDiet: { name: string, code: string, diet: { code: string, description: string }, notes: string }[],
                lunchDiet: { name: string, code: string, diet: { code: string, description: string }, notes: string }[],
                dinnerDiet: { name: string, code: string, diet: { code: string, description: string }, notes: string }[]
            }[]
        })[];

        if (!result[0]) {
            throw new Error("Brak danych");
        }

        const report = getConsumersMonthReport(result[0].orders);

        return report;

    });

const groupedByMonth = {
    tableForClient,
    countForClient,
    monthForClient,
}


export default groupedByMonth;
