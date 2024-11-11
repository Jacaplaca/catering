import { OrderStatus } from '@prisma/client';
import getJobId from '@root/app/server/api/routers/specific/libs/getJobId';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { format } from 'date-fns-tz';

const orderedDates = createCateringProcedure(['client'])
    .query(async ({ ctx }) => {
        const { session: { catering }, db } = ctx;

        const clientId = await getJobId({
            userId: ctx.session.user.id,
            cateringId: catering.id,
            roleId: 'client'
        });

        const today = new Date();
        const twoWeeksFromNow = new Date(today);
        twoWeeksFromNow.setDate(today.getDate() + 14);
        const twoWeeksFromNotObject = {
            year: twoWeeksFromNow.getFullYear(),
            month: twoWeeksFromNow.getMonth(),
            day: twoWeeksFromNow.getDate()
        }

        const orders = await db.order.findMany({
            where: {
                clientId,
                cateringId: catering.id,
                status: {
                    not: OrderStatus.draft
                },
                OR: [
                    {
                        deliveryDay: {
                            is:
                                { year: { lt: twoWeeksFromNotObject.year } }
                        }
                    },
                    {
                        deliveryDay: {
                            is: {
                                year: twoWeeksFromNotObject.year,
                                month: { lt: twoWeeksFromNotObject.month }
                            }
                        }
                    },
                    {
                        deliveryDay: {
                            is: {
                                year: twoWeeksFromNotObject.year,
                                month: twoWeeksFromNotObject.month,
                                day: { lte: twoWeeksFromNotObject.day }
                            }
                        }
                    }
                ]
            }
        });

        return orders.map(order => {
            const date = new Date(order.deliveryDay.year, order.deliveryDay.month, order.deliveryDay.day);
            return format(date, 'yyyy-MM-dd');
        });
    });

export default orderedDates;