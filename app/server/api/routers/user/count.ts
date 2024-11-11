import getUsersDBQuery from '@root/app/server/api/routers/user/libs/getUsersDbQuery';
import { createRoleProcedure } from '@root/app/server/api/trpc';
import { db } from '@root/app/server/db';
import { getUsersCount } from '@root/app/validators/user';
import { settings } from '@root/config/config';

const count = createRoleProcedure(settings.superAdminRole)
    .input(getUsersCount)
    .query(async ({ input }) => {
        const { role, searchValue } = input;
        const query = getUsersDBQuery({ role, searchValue });
        return await db.user.count(query);
    });

export default count;
