import { RoleType } from '@prisma/client';
import { publicProcedure } from '@root/app/server/api/trpc';
import { db } from '@root/app/server/db';

const getManagerClientsProfiles = publicProcedure
    .query(async ({ ctx }) => {
        if (!ctx?.session?.user) {
            return null;
        }
        const role = ctx.session.user.roleId;
        if (role !== RoleType.client) {
            return null;
        }
        return db.client.findMany({
            where: {
                userId: ctx.session.user.id,
                deactivated: false
            }
        });
    });

export default getManagerClientsProfiles;
