import { RoleType } from '@prisma/client';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';

const addClient = createCateringProcedure([RoleType.client])
    .mutation(async ({ ctx }) => {
        const { db, session } = ctx;
        const { user, catering } = session;

        return await db.client.create({
            data: {
                cateringId: catering.id,
                userId: user.id,
                settings: {},
                info: {}
            }
        })
    })

export default addClient;