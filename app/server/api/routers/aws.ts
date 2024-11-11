import { protectedProcedure } from "server/api/trpc";
import { z } from 'zod';

import { s3getPresign, s3putPresign } from '@root/app/server/s3/presign';
import { s3getFiles, s3getKeys } from '@root/app/server/s3/list';
import { s3deleteFromPrefix, s3deleteKeys } from '@root/app/server/s3/delete';
import { buildDirectoryTree } from '@root/app/server/s3/tree';

export const awsRouter = {
    getFile: protectedProcedure
        .input(z.object({ key: z.string() }))
        .query(async ({ input }) => {
            return (await s3getPresign([input.key]))[0];
        }),
    getFiles: protectedProcedure
        .input(z.object({ prefix: z.string() }))
        .query(async ({ input }) => {
            return await s3getFiles(input.prefix);
        }),
    getKeys: protectedProcedure
        .input(z.object({ prefix: z.string() }))
        .query(async ({ input }) => {
            return await s3getKeys(input.prefix);
        }),
    deleteFiles: protectedProcedure
        .input(z.object({ key: z.string() }))
        .mutation(async ({ input }) => {
            return await s3deleteKeys([input.key]);
        }),
    deleteBucket: protectedProcedure
        .input(z.object({ prefix: z.string() }))
        .mutation(async ({ input }) => {
            await s3deleteFromPrefix(input.prefix);
            return 'Bucket deleted';

        }),
    createPresignedUrls: protectedProcedure
        .input(z.object({ count: z.number().gte(1), prefix: z.string().optional() }))
        .query(async ({ input }) => {
            const { count, prefix } = input;
            return await s3putPresign({ count, prefix });
        }),
    getTree: protectedProcedure
        .input(z.object({ prefix: z.string().optional() }))
        .query(async ({ input }) => {
            const { prefix } = input;
            return await buildDirectoryTree(prefix);
        }),
    replaceFile: protectedProcedure
        .input(z.object({ key: z.string() }))
        .mutation(async ({ input }) => {
            return await s3putPresign({ key: input.key });
        }),
};