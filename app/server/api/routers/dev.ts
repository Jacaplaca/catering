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
    testWithInputs: publicProcedure
        .input(z.object({
            a: z.string(),
        }))
        .query(({ input }) => {
            return `Hello World! ${input.a}`;
        }),
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
