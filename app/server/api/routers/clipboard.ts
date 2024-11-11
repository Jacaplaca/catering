
import { type Prisma } from '@prisma/client';
import { db } from '@root/app/server/db';
import updateClipboard from '@root/app/server/lib/clipboard';
import { getClipboard, setClipboard } from '@root/app/validators/clipboard';
import { safeJSON } from 'openai/core';
import { protectedProcedure } from "server/api/trpc";

export const clipboardRouter = {
  getClipboard: protectedProcedure.input(getClipboard)
    .query(async ({ input, ctx }) => {
      const { key } = input;
      const clip = await db.clipboard.findUnique({
        where: {
          userId_key: { key, userId: ctx.session.user.id }
        },
      });
      return { value: clip?.value ?? null };
    }),
  postClipboard: protectedProcedure.input(setClipboard)
    .mutation(async ({ input, ctx }) => {
      const { key, value } = input;
      const parsed = safeJSON(value) as Prisma.JsonValue;
      if (parsed === null) {
        throw new Error('Parsed value cannot be null');
      }
      await updateClipboard({ key, value: parsed, userId: ctx.session.user.id });
    })

};
