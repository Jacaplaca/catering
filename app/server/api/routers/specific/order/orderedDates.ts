import { OrderStatus, RoleType } from '@prisma/client';
import getCurrentTime from '@root/app/lib/date/getCurrentTime';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { orderedDatesValid } from '@root/app/validators/specific/order';
import { format } from 'date-fns-tz';

const orderedDates = createCateringProcedure([RoleType.client])
    .input(orderedDatesValid)
    .query(async ({ ctx, input }) => {
        const { session: { catering }, db } = ctx;
        const { clientId } = input;

        const today = getCurrentTime();
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