import { RoleType } from '@prisma/client';
import getLowerCaseSort from '@root/app/lib/lower-case-sort-pipeline';
import getClientsDbQuery from '@root/app/server/api/routers/specific/libs/getClientsDbQuery';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { db } from '@root/app/server/db';
import { getClientListValid } from '@root/app/validators/specific/client';
import { type ClientCustomTable } from '@root/types/specific';
import { options } from '@root/app/server/api/specific/aggregate';

const getInfinite = createCateringProcedure([RoleType.manager, RoleType.kitchen, RoleType.dietician])
    .input(getClientListValid)
    .query(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { cursor, limit, name } = input;
        const skip = cursor ?? 0;

        const pipeFragment = [
            {
                $match: {
                    "info.name": {
                        $type: "string",
                        $regex: "^.{2,}$",
                        $options: ""
                    }
                }
            },
            ...getClientsDbQuery({ searchValue: name, catering, showColumns: ['info.name'] })]

        const pipelineData = [
            ...pipeFragment,
            ...getLowerCaseSort({ "info.name": 1 }),
            { $addFields: { name: "$info.name" } },
            { $skip: skip },
            { $limit: limit },
        ]

        const pipelinCount = [
            ...pipeFragment,
            { $count: 'count' },
        ]

        const [items, totalCountObj] = await Promise.all([
            db.client.aggregateRaw({
                pipeline: pipelineData,
                options
            }) as unknown as (ClientCustomTable & { name: string })[],
            db.client.aggregateRaw({
                pipeline: pipelinCount
            }) as unknown as { count: number }[]
        ])
        const totalCount = totalCountObj[0]?.count ?? 0;

        const nextCursor = skip + limit < totalCount ? skip + limit : undefined;

        return {
            items,
            nextCursor,
            totalCount,
        }
    });

export default getInfinite;