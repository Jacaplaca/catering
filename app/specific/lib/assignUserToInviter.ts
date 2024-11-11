import { RoleType, type User } from '@prisma/client';
import { db } from '@root/app/server/db';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assignUserToInviter = async ({ user, inviterId }: {
    user: User
    inviterId?: string
}) => {
    //content of this function is heavily dependent on the project's specific requirements
    const cateringId = inviterId ? (await db.user.findUnique({
        where: {
            id: inviterId,
        },
    }))?.cateringId : null;

    if (user) {

        const addCateringToUser = async (cateringId: string) => await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                cateringId,
            },
        });

        switch (user.roleId) {
            case RoleType.superAdmin:
                await db[RoleType.superAdmin].create({
                    data: {
                        userId: user.id,
                    },
                });
                break;
            case RoleType.manager:
                const catering = await db.catering.create({
                    data: {
                        settings: {
                            // name: user.name,
                        },
                    }
                });
                await db[RoleType.manager].create({
                    data: {
                        userId: user.id,
                        cateringId: catering.id,
                    },
                });
                await addCateringToUser(catering.id);
                break;

            case RoleType.client:
                if (cateringId) {


                    await db[RoleType.client].create({
                        data: {
                            userId: user.id,
                            cateringId,
                            settings: {},
                            info: {},
                        },
                    });
                    await addCateringToUser(cateringId);
                }
                break;

            case RoleType.dietician:
                if (cateringId) {
                    await db[RoleType.dietician].create({
                        data: {
                            userId: user.id,
                            cateringId,
                        },
                    });
                    await addCateringToUser(cateringId);
                }
                break;

            case RoleType.kitchen:
                if (cateringId) {
                    await db[RoleType.kitchen].create({
                        data: {
                            userId: user.id,
                            cateringId,
                        },
                    });
                    await addCateringToUser(cateringId);
                }
                break;
        }
    }
};

export default assignUserToInviter;