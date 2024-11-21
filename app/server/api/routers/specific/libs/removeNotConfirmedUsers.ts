import { type User } from '@prisma/client';
import { db } from '@root/app/server/db';

const removeNotConfirmedUsers = async (users: User[]) => {

    try {
        for (const user of users) {
            const { id } = user;
            const whereCondition = { userId: id };

            const removeUser = async (id: string) => db.user.delete({ where: { id } });

            switch (user.roleId) {
                case 'client':
                    await db.client.delete({ where: whereCondition });
                    break;
                case 'dietician':
                    await db.dietician.delete({ where: whereCondition });
                    break;
                case 'kitchen':
                    await db.kitchen.delete({ where: whereCondition });
                    break;
                case 'manager':
                    const manager = await db.manager.findFirst({ where: whereCondition });
                    await db.manager.delete({ where: whereCondition });
                    await db.catering.delete({ where: { id: manager?.cateringId } });
                    break;
                case 'superAdmin':
                    await db.superAdmin.delete({ where: whereCondition });
                    break;
            }
            await removeUser(id);
        }

        return { success: true, deletedUsers: users };
    } catch (error) {
        console.error("Error while removing users:", error);
        throw error;
    }
}

export default removeNotConfirmedUsers;