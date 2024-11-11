
import getContent from '@root/app/server/lib/getContent';
import { getPageValidator } from '@root/app/validators/pageValidators';
import { publicProcedure } from "server/api/trpc";

export const pageRouter = {
  get: publicProcedure
    .input(getPageValidator)
    .query(async ({ ctx, input }) => {
      const { lang, key } = input;
      return await getContent(ctx.db, { lang, key, contentType: 'page' });
    }),
};
