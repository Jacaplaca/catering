
import getContent from '@root/app/server/lib/getContent';
import { getMdContentValidator } from '@root/app/validators/mdContentValidators';
import { publicProcedure } from "server/api/trpc";

export const mdContentRouter = {
  get: publicProcedure
    .input(getMdContentValidator)
    .query(({ ctx, input }) => {
      const { lang, key } = input;
      return getContent(ctx.db, { lang, key, contentType: 'mdContent' });
    }),
};
