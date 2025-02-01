import getLowerCaseSort from '@root/app/lib/lower-case-sort-pipeline';
import { getQueryOrder, getQueryPagination } from '@root/app/lib/safeDbQuery';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { db } from '@root/app/server/db';
import { getClientsFiles as clientsFilesValidator } from '@root/app/validators/specific/clientFiles';
import { type ClientFilesCustomTable, clientSortNames } from '@root/types/specific';
import { options } from '@root/app/server/api/specific/aggregate';
import getClientsFilesListDbQuery from '@root/app/server/api/routers/specific/libs/getClientsFilesListDbQuery';
import { RoleType } from '@prisma/client';

const getMany = createCateringProcedure([RoleType.dietician, RoleType.manager])
    .input(clientsFilesValidator)
    .query(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { page, limit, sortName, sortDirection, day, searchValue } = input;

        const pagination = getQueryPagination({ page, limit });

        const allowedSortNames = clientSortNames;

        const orderBy = getQueryOrder({
            name: sortName,
            direction: sortDirection,
            allowedNames: allowedSortNames,
            inNumbers: true
        });

        const pipeline = [
            ...getClientsFilesListDbQuery({ catering, day, searchValue }),
            ...getLowerCaseSort(orderBy),
            { $skip: pagination.skip },
            { $limit: pagination.take },
        ]

        const result = await db.client.aggregateRaw({
            pipeline,
            options
        }) as unknown as ClientFilesCustomTable[];

        return result;
    });

export default getMany;