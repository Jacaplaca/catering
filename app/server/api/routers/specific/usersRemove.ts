import { createRoleProcedure } from '@root/app/server/api/trpc';
import { removeUsers, } from '@root/app/validators/user';
import { settings } from '@root/config/config';

const remove = createRoleProcedure([settings.superAdminRole])
    .input(removeUsers)
    .mutation(async ({ ctx, input }) => {
        const isSuperAdmin = ctx.session.user.roleId === settings.superAdminRole;
        const { db, session } = ctx
        const { ids } = input;
        const { cateringId, id: doerId } = session.user;
        const idsWithoutMe = ids.filter((id) => id !== doerId)
        for (const id of idsWithoutMe) {
            const user = await db.user.findUnique({
                where: {
                    id
                }
            })
            if (user?.roleId) {
                const whereCondition = { where: { userId: id } } as
                    { where: { userId: string, cateringId?: string } }

                if (cateringId) {
                    whereCondition.where.cateringId = cateringId;
                }

                switch (user?.roleId) {
                    case 'client':
                        await db.client.delete(whereCondition);
                        break;
                    case 'dietician':
                        await db.dietician.delete(whereCondition);
                        break;
                    case 'kitchen':
                        await db.kitchen.delete(whereCondition);
                        break;
                    case 'manager':
                        isSuperAdmin && await db.manager.delete(whereCondition);
                        break;
                }

                await db.user.update({
                    where: { id },
                    data: {
                        roleId: null,
                        cateringId: null
                    }
                });

                if (isSuperAdmin) {
                    await db.client.deleteMany({ where: { userId: id } });
                    await db.dietician.deleteMany({ where: { userId: id } });
                    await db.kitchen.deleteMany({ where: { userId: id } });
                    await db.manager.deleteMany({ where: { userId: id } });

                    await db.user.delete({
                        where: { id }
                    });
                }
            }
        }
        return { success: true }
    })

export default remove;