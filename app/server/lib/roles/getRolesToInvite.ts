import { type RoleType } from '@prisma/client';
import { db } from "server/db";

const getRolesToInvite = async (roleName: RoleType) => {
    const rolesToInvite = await db.role.findMany({
        where: {
            inviteBy: { hasSome: [roleName] },
        }
    });
    return rolesToInvite;
}

export default getRolesToInvite;