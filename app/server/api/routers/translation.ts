
import {
  publicProcedure,
} from "server/api/trpc";
import { getTranslationsValidator } from '@root/app/validators/translation';
import { getDict } from '@root/app/server/cache/translations';

export const translationRouter = {
  getLangGroup: publicProcedure
    .input(getTranslationsValidator)
    .query(async ({ input }) => {
      const { lang, keys, key } = input;
      if (!keys && !key) {
        return {};
      }
      if (keys?.length) {
        return await getDict({ lang, keys });
      }
      if (key) {
        return await getDict({ lang, key });
      }
    })
};
