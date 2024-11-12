import { RoleType } from '@prisma/client';
import getLowerCaseSort from '@root/app/lib/lower-case-sort-pipeline';
import getClientsDbQuery from '@root/app/server/api/routers/specific/libs/getClientsDbQuery';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { db } from '@root/app/server/db';
import { options } from '@root/app/server/api/specific/aggregate';

const getAll = createCateringProcedure([RoleType.dietician, RoleType.manager])
    .query(({ ctx }) => {
        const { session: { catering } } = ctx;

        const pipeFragment = [
            ...getClientsDbQuery({ catering, showColumns: ['info.name'] })]

        const pipelineData = [
            ...pipeFragment,
            ...getLowerCaseSort({ "info.name": 1 }),
            { $addFields: { name: "$info.name" } },
        ]

        return db.client.aggregateRaw({
            pipeline: pipelineData,
            options
        }) as unknown as ({ name: string, id: string, code: string })[]

    });

export default getAll;