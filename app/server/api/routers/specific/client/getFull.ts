import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { db } from '@root/app/server/db';
import { getClientValidator } from '@root/app/validators/specific/client';

const getFull = createCateringProcedure('manager')
    .input(getClientValidator)
    .query(({ input, ctx }) => {
        const { session: { user: doer } } = ctx;
        const { id } = input;

        return db.client.findUnique({
            where: { id, cateringId: doer.cateringId },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                },
                user: {
                    select: {
                        passwordHash: false,
                        createdAt: false,
                        updatedAt: false,
                        email: false,
                        name: true
                    }
                }
            },
        });
    });

export default getFull;