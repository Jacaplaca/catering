import getCurrentTime from '@root/app/lib/date/getCurrentTime';
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
