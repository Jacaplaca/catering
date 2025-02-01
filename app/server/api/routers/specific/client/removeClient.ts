import { OrderStatus, RoleType } from '@prisma/client';
import { createCateringNotSettingsProcedure } from '@root/app/server/api/specific/trpc';
import { removeClientValidator } from '@root/app/validators/specific/client';

const removeClient = createCateringNotSettingsProcedure([RoleType.client])
    .input(removeClientValidator)
    .mutation(async ({ ctx, input }) => {
        const { db, session } = ctx;
        const { user, catering } = session;

        const countClients = await db.client.count({
            where: {
                cateringId: catering.id,
                userId: user.id,
                deactivated: false
            }
        })

        if (countClients <= 1) {
            return;
        }

        // const ordersToDelete = await db.order.findMany({
        //     where: {
        //         clientId: {
        //             in: input.ids
        //         },
        //         status: OrderStatus.draft
        //     }
        // });

        await db.order.deleteMany({
            where: {
                clientId: {
                    in: input.ids
                },
                status: OrderStatus.draft
            }
        });

        // await db.orderConsumerBreakfast.deleteMany({
        //     where: {
        //         orderId: {
        //             in: ordersToDelete.map(order => order.id)
        //         }
        //     }
        // });

        // await db.orderConsumerLunch.deleteMany({
        //     where: {
        //         orderId: {
        //             in: ordersToDelete.map(order => order.id)
        //         }
        //     }
        // });

        // await db.orderConsumerDinner.deleteMany({
        //     where: {
        //         orderId: {
        //             in: ordersToDelete.map(order => order.id)
        //         }
        //     }
        // });

        // await db.orderConsumerLunchBeforeDeadline.deleteMany({
        //     where: {
        //         orderId: {
        //             in: ordersToDelete.map(order => order.id)
        //         }
        //     }
        // });

        // await db.orderConsumerDinnerBeforeDeadline.deleteMany({
        //     where: {
        //         orderId: {
        //             in: ordersToDelete.map(order => order.id)
        //         }
        //     }
        // });

        const ordersToLeave = await db.order.count({
            where: {
                clientId: {
                    in: input.ids
                },
            }
        });



        if (ordersToLeave > 0) {
            await db.client.updateMany({
                where: {
                    id: {
                        in: input.ids
                    },
                    cateringId: catering.id,
                    userId: user.id,
                },
                data: {
                    deactivated: true
                }
            })
        } else {
            await db.consumer.deleteMany({
                where: {
                    clientId: {
                        in: input.ids
                    },
                    cateringId: catering.id,
                }
            });
            await db.client.deleteMany({
                where: {
                    id: {
                        in: input.ids
                    },
                    cateringId: catering.id,
                    userId: user.id,
                }
            })
        }

        return true;
    })

export default removeClient;