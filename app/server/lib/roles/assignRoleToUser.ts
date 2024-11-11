import { type RoleType } from '@prisma/client';
import { updateSetting } from '@root/app/server/cache/settings';
import assignUserToInviter from '@root/app/specific/lib/assignUserToInviter';
import { db } from "server/db";

type AssignRoleToUserParams = {
    userId: string;
    roleId?: RoleType;
    inviterId?: string;
};

const assignRoleToUser = async ({ userId, roleId, inviterId }: AssignRoleToUserParams) => {
    if (!roleId) {
        return;
    }

    const role = await db.role.findUnique({
        where: {
            id: roleId
        }
    });

    if (!role) {
        return;
    }

    const { closeRegistration } = role;
    closeRegistration && await updateSetting({ group: 'main', name: 'openRegistration', value: false });

    const user = await db.user.findUnique({
        where: {
            id: userId,
        }
    });

    if (user?.roleId) {
        console.log('User already has a role assigned. Skipping.');
        return;
    }

    const updatedUser = await db.user.update({
        where: {
            id: userId,
        },
        data: {
            role: {
                connect: {
                    id: roleId,
                },
            },
            inviter: inviterId
                ? {
                    connect: {
                        id: inviterId,
                    },
                }
                : undefined,
        },
    });

    await assignUserToInviter({ user: updatedUser, inviterId });
    return updatedUser;
};

export default assignRoleToUser;