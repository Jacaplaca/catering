import { protectedProcedure } from "server/api/trpc";
import { getRolesToInviteValidator } from '@root/app/validators/role';
import getRolesToInvite from '@root/app/server/lib/roles/getRolesToInvite';
import { getDict } from '@root/app/server/cache/translations';
import { db } from '@root/app/server/db';

export const roleRouter = {
    getRolesToInvite: protectedProcedure
        .input(getRolesToInviteValidator)
        .query(async ({ ctx, input }) => {
            const { lang } = input;
            const { session } = ctx;
            const { user } = session;
            const { roleId } = user;

            const rolesToInvite = await getRolesToInvite(roleId);
            const toInvite = {} as Record<string, string>;
            const rolesTranslations = await getDict({ lang, key: 'role' });

            rolesToInvite.forEach(role => {
                const translation = rolesTranslations[role.id];
                if (translation) {
                    toInvite[role.id] = translation;
                }
            });

            return Object.entries(toInvite).map(([name, translation]) => ({
                value: name,
                label: translation,
            }));
        }),
    getAllowedRoles: protectedProcedure
        .query(async ({ ctx }) => {
            const { session } = ctx;
            const { user } = session;
            const { roleId } = user;

            const allRoles = await db.role.findMany()
            if (roleId === 'superAdmin') {
                return allRoles;
            }
            const userRole = allRoles.find(role => role.id === roleId);
            const rolesToInvite = await getRolesToInvite(roleId);
            const allowedRoles = rolesToInvite;
            if (userRole) {
                allowedRoles.push(userRole);
            }
            return allowedRoles;
        }),
};