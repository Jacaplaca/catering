// import { OrderStatus } from '@prisma/client';
import getCurrentTime from '@root/app/lib/date/getCurrentTime';
import { db } from '@root/app/server/db';
// import { getNextWorkingDay } from '@root/app/lib/date/getNextWorkingDay';
// import { db } from '@root/app/server/db';
import autoOrder from '@root/app/server/lib/autoOrder';
import autoReceiveEmail from '@root/app/server/lib/autoReceiveEmail';
import dbBackup from '@root/app/server/lib/makeBackup/backup';
import { publicProcedure } from "server/api/trpc";
import { z } from 'zod';


export const devRouter = {
    testAbc: publicProcedure.query(() => {
        return "Hello World!";
    }),
    test: publicProcedure.query(() => {
        return "Hello World!";
    }),
    backup: publicProcedure.query(async () => {
        const fileName = await dbBackup();
        return { backupFileName: fileName };
    }),
    autoOrder: publicProcedure.query(async () => {
        await autoOrder();
        return { autoOrder: 'success' };
    }),
    receiver: publicProcedure.query(async () => {
        await autoReceiveEmail();
        return { received: 'success' };
    }),
    //TODO: remove this
    removeOrder: publicProcedure.input(z.object({
        orderId: z.string(),
    })).query(async ({ input }) => {
        await db.order.delete({
            where: { id: input.orderId },
        });
    }),
    // findForbiddenOrders: publicProcedure.query(async () => {
    //     const nextWorkingDay = getNextWorkingDay(new Date(), 'Europe/Warsaw');
    //     const year = nextWorkingDay.getFullYear();
    //     const month = nextWorkingDay.getMonth();
    //     const day = nextWorkingDay.getDate();

    //     const afterNextWorkingDayOrders = await db.order.findMany({
    //         where: {
    //             OR: [
    //                 { deliveryDay: { is: { year: { gt: year } } } },
    //                 {
    //                     AND: [
    //                         { deliveryDay: { is: { year: year } } },
    //                         { deliveryDay: { is: { month: { gt: month } } } }
    //                     ]
    //                 },
    //                 {
    //                     AND: [
    //                         { deliveryDay: { is: { year: year } } },
    //                         { deliveryDay: { is: { month: month } } },
    //                         { deliveryDay: { is: { day: { gt: day } } } }
    //                     ]
    //                 }
    //             ]
    //         },
    //     });

    //     return afterNextWorkingDayOrders;
    // }),
    // removeForbiddenOrders: publicProcedure.mutation(async () => {
    //     // Pobieramy następny dzień roboczy
    //     const nextWorkingDay = getNextWorkingDay(new Date(), 'Europe/Warsaw');
    //     const year = nextWorkingDay.getFullYear();
    //     const month = nextWorkingDay.getMonth();
    //     const day = nextWorkingDay.getDate();

    //     const toDelete = await db.order.deleteMany({
    //         where: {
    //             OR: [
    //                 { deliveryDay: { is: { year: { gt: year } } } },
    //                 {
    //                     AND: [
    //                         { deliveryDay: { is: { year: year } } },
    //                         { deliveryDay: { is: { month: { gt: month } } } }
    //                     ]
    //                 },
    //                 {
    //                     AND: [
    //                         { deliveryDay: { is: { year: year } } },
    //                         { deliveryDay: { is: { month: month } } },
    //                         { deliveryDay: { is: { day: { gt: day } } } }
    //                     ]
    //                 },
    //                 {
    //                     status: OrderStatus.draft,
    //                 }
    //             ]
    //         },
    //     });


    //     return {
    //         count: toDelete,
    //     };
    // }),
    dbg: publicProcedure
        .input(z.object({
            time: z.string(),
        }))
        .query(({ input }) => {
            console.log(input);
            const desiredTimeZone = 'Europe/Warsaw';
            const dateTime = getCurrentTime();
            return {
                dateTime,
                dateTimeString: dateTime.toLocaleString(),
                dateTimeJson: dateTime.toJSON(),
                desiredTimeZone,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                myTime: input.time,
            }
        }),
    // testWithInputs: publicProcedure
    //     .input(z.object({
    //         a: z.string(),
    //     }))
    //     .query((request) => {
    //         const { input } = request;
    //         console.log('request', request, input);
    //         return `Hello World!`;
    //     }),
    // activation: publicProcedure
    //     .mutation(async ({ ctx }) => {

    //         const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '');

    //         await sendActivationRequest({
    //             to: "example@somedomain.com",
    //             token,
    //             lang: "en",
    //         });

    //         return NextResponse.json({
    //             token,
    //         });
    //     })
};
