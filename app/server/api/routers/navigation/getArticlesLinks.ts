import translatePath from '@root/app/lib/url/translatePath';
import { publicProcedure } from '@root/app/server/api/trpc';
import { getArticlesLinksValidator } from '@root/app/validators/article';
import { i18n } from '@root/i18n-config';

const getArticlesLinks = publicProcedure
    .input(getArticlesLinksValidator)
    .query(async ({ ctx, input }) => {
        const { lang, group, category, ignoreKeys, limit } = input;
        const articles = await ctx.db.article.findMany({
            where: {
                lang,
                group,
                categories: {
                    hasSome: category ? [category] : []
                },
                NOT: {
                    key: {
                        in: ignoreKeys ?? []
                    }
                }
            },
            orderBy: { date: "desc" },
            take: limit ?? 10,
            select: {
                slug: true,
                title: true,
            }
        });

        return articles.map((article) => ({
            url: translatePath({
                sourceLocale: i18n.appStructureLocale,
                targetLocale: lang,
                sourcePath: `/${group}/${article.slug}`,
            }),
            title: article.title,
        }));
    })

export default getArticlesLinks;