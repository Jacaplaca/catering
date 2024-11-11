import { RoleType } from '@prisma/client';
import { db } from '@root/app/server/db';

const getJobId = async ({
    userId,
    cateringId,
    roleId,
}: {
    userId: string;
    cateringId: string;
    roleId: RoleType;
}): Promise<string | undefined> => {
    const query = {
        where: {
            cateringId,
            userId,
        },
        select: {
            id: true,
        },
    };

    let result;
    switch (roleId) {
        case RoleType.client:
            result = await db.client.findFirst(query);
            break;
        case RoleType.dietician:
            result = await db.dietician.findFirst(query);
            break;
        case RoleType.manager:
            result = await db.manager.findFirst(query);
            break;
        default:
            return undefined;
    }

    return result?.id;
}

export default getJobId;

