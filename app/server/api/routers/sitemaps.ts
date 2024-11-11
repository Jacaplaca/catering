
import makeHref from '@root/app/lib/url/makeHref';
import { getSitemapValidator } from '@root/app/validators/sitemapValidators';
import { publicProcedure } from "server/api/trpc";

export const sitemapRouter = {
  get: publicProcedure
    .input(getSitemapValidator)
    .query(async ({ ctx, input }) => {
      const { lang } = input;
      const sitemap = await ctx.db.sitemap.findMany();
      const identifiers = sitemap.map((item) => item.identifier);
      const pages = await ctx.db.page.findMany({
        where: {
          lang,
          key: {
            in: identifiers,
          },
        },
      });

      return pages.map((page) => ({
        name: page.title,
        url: makeHref({ lang, page: page.key }, true)
      }));

    }),
}
