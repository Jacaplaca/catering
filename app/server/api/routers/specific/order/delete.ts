import { OrderStatus, RoleType } from '@prisma/client';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { deleteManyValid } from '@root/app/validators/specific/order';

const deleteMany = createCateringProcedure([RoleType.client, RoleType.manager])
    .input(deleteManyValid)
    .mutation(async ({ ctx, input }) => {
        const { db, session } = ctx;
        const { catering } = session;
        const roleId = session?.user.roleId;

        const results = await Promise.all(input.ids.map(async (orderId) => {
            return db.$transaction(async (tx) => {
                const whereClause = roleId === RoleType.client
                    ? { id: orderId, cateringId: catering.id, status: OrderStatus.draft }
                    : { id: orderId, cateringId: catering.id };

                const order = await tx.order.findFirst({ where: whereClause });
                if (!order) return null;

                await tx.orderConsumerBreakfast.deleteMany({ where: { orderId } });
                await tx.orderConsumerLunch.deleteMany({ where: { orderId } });
                await tx.orderConsumerDinner.deleteMany({ where: { orderId } });
                await tx.orderConsumerLunchBeforeDeadline.deleteMany({ where: { orderId } });
                await tx.orderConsumerDinnerBeforeDeadline.deleteMany({ where: { orderId } });
                return tx.order.delete({ where: { id: orderId } });
            });
        }));

        const deletedCount = results.filter(Boolean).length;
        return { count: deletedCount };
    });

export default deleteMany;