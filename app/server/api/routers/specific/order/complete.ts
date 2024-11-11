import { OrderStatus, RoleType } from '@prisma/client';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { completeValid } from '@root/app/validators/specific/order';

const complete = createCateringProcedure([RoleType.manager, RoleType.kitchen])
    .input(completeValid)
    .mutation(({ ctx, input }) => {
        const { db, session } = ctx;
        const { catering } = session;

        return db.order.updateMany({
            where: {
                id: { in: input.ids },
                cateringId: catering.id,
                status: OrderStatus.in_progress
            },
            data: {
                status: OrderStatus.completed
            }
        });
    });

export default complete;