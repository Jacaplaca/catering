import { getQueryOrder, getQueryPagination } from '@root/app/lib/safeDbQuery';
import getUsersDBQuery from '@root/app/server/api/routers/user/libs/getUsersDbQuery';
import { createRoleProcedure } from '@root/app/server/api/trpc';
import { db } from '@root/app/server/db';
import { getUsers } from '@root/app/validators/user';
import { settings } from '@root/config/config';
import { sleep } from 'openai/core';

const fetch = createRoleProcedure(settings.superAdminRole)
    .input(getUsers)
    .query(async ({ input }) => {
        const { role, page, limit, sortName, sortDirection, searchValue } = input;
        await sleep(1000);

        const select = {
            id: true,
            email: true,
            emailVerified: true,
            passwordHash: false,
            roleId: true,
            createdAt: true,
            name: true,
        }

        const pagination = getQueryPagination({ page, limit });

        const allowedSortNames = ['name', 'email'];

        const orderBy = getQueryOrder({
            name: sortName,
            direction: sortDirection,
            allowedNames: allowedSortNames,
        });

        const query = getUsersDBQuery({ role, searchValue });

        return db.user.findMany({ ...query, select, ...pagination, orderBy });
    });

export default fetch;