import getCurrentTime from '@root/app/lib/date/getCurrentTime';
import { removeExpiredInviteTokens } from '@root/app/lib/removeExpiredTokens';
import { getUserByIdFromDB } from '@root/app/server/lib/getUserDb';
import assignAutoRoleDuringConfirmation from '@root/app/server/lib/roles/assignAutoRoleDuringConfirmation';
import assignRoleToUser from '@root/app/server/lib/roles/assignRoleToUser';
import { db } from "server/db";

const autoAssignRoleToUser = async ({ userId, inviteToken }: { userId?: string, inviteToken?: string }) => {
    if (!userId) { return; }

    const userFromDb = await getUserByIdFromDB(userId);

    if (!userFromDb) { return; }

    if (userFromDb.roleId) { return; }

    if (inviteToken) {
        await removeExpiredInviteTokens();
        const tokenFromDb = await db.inviteToken.findUnique({
            where: {
                token: inviteToken.toLowerCase().trim(),
                expires: {
                    gt: getCurrentTime()
                }
            }, include: {
                inviter: true,
                role: true
            }
        });

        if (tokenFromDb && tokenFromDb.inviter) {
            const { role, inviterId } = tokenFromDb;
            if (role) {
                await assignRoleToUser({ userId, inviterId, roleId: role.id });
                await db.inviteToken.delete({
                    where: {
                        id: tokenFromDb.id
                    }
                });
                return;
            }
        }

    }

    return await assignAutoRoleDuringConfirmation(userId);
}

export default autoAssignRoleToUser;