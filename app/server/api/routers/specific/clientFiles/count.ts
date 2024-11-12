import { RoleType } from '@prisma/client';
import getClientsFilesListDbQuery from '@root/app/server/api/routers/specific/libs/getClientsFilesListDbQuery';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { db } from '@root/app/server/db';
import { getClientsFilesCount as countValidator } from '@root/app/validators/specific/clientFiles';

const count = createCateringProcedure([RoleType.dietician, RoleType.manager])
    .input(countValidator)
    .query(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { day, searchValue } = input;

        const count = await db.client.aggregateRaw({
            pipeline: [
                ...getClientsFilesListDbQuery({ catering, day, searchValue, count: true }),
                { $count: 'count' },
            ]
        }) as unknown as { count: number }[];
        return count[0]?.count ?? 0;
    });

export default count;
