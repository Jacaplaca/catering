import { RoleType } from '@prisma/client';
import getLowerCaseSort from '@root/app/lib/lower-case-sort-pipeline';
import getClientsDbQuery from '@root/app/server/api/routers/specific/libs/getClientsDbQuery';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { db } from '@root/app/server/db';
import { options } from '@root/app/server/api/specific/aggregate';

const getActiveWithCode = createCateringProcedure([RoleType.dietician, RoleType.manager])
    .query(async ({ ctx }) => {
        const { session: { catering } } = ctx;

        const pipeFragment = [
            ...getClientsDbQuery({ catering, showColumns: ['info.name'] })]

        const pipelineData = [
            { $match: { deactivated: false, "info.code": { $ne: null } } },
            ...pipeFragment,
            ...getLowerCaseSort({ "info.name": 1 }),
            { $addFields: { name: "$info.name" } },
        ]

        const result = await db.client.aggregateRaw({
            pipeline: pipelineData,
            options
        }) as unknown as ({ name: string, id: string, code: string })[]

        return result

    });

export default getActiveWithCode;