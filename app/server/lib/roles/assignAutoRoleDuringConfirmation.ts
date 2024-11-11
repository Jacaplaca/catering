import { type RoleType } from '@prisma/client';
import assignRoleToUser from '@root/app/server/lib/roles/assignRoleToUser';
import { db } from "server/db";

const assignAutoRoleDuringConfirmation = async (userId: string) => {
    const usersLength = await db.user.count();
    const availableRoles = await db.role.findMany({
        where: {
            order: {
                not: null
            }
        }
    }) as { id: RoleType, order: number }[];

    if (!availableRoles) {
        throw new Error("No roles found");
    }

    const maxOrder = availableRoles.length > 0 ? Math.max(...availableRoles.map(role => role.order)) : 0;
    const autoRoleForUser = availableRoles.find(role => role.order === usersLength);
    const lastAutoRole = availableRoles.find(role => role.order === maxOrder);
    const roleId = autoRoleForUser ? autoRoleForUser.id : lastAutoRole?.id;
    await assignRoleToUser({ userId, roleId });
}

export default assignAutoRoleDuringConfirmation;