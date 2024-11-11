import translate from '@root/app/lib/lang/translate';
import translatePath from '@root/app/lib/url/translatePath';
import { publicProcedure } from '@root/app/server/api/trpc';
import { getDict } from '@root/app/server/cache/translations';
import { mainMenuValidator } from '@root/app/validators/user';
import { i18n } from '@root/i18n-config';

const getMainMenu = publicProcedure
    .input(mainMenuValidator)
    .query(async ({ ctx, input }) => {
        const { lang } = input;
        const menu = await ctx.db.mainMenu.findMany({
            orderBy: { order: "asc" },
        });
        const hasChildrenIdentifiers = menu.filter((item) => item.hasChildren).map((item) => item.identifier);
        const articles = await ctx.db.article.findMany({
            where: {
                group: {
                    in: hasChildrenIdentifiers
                },
                lang
            },
            orderBy: { anchor: "asc" },
            select: {
                slug: true,
                group: true,
                anchor: true,
            }
        });

        const menuWithChildren = menu
            .filter(({ loginRequired }) => {
                if (loginRequired) {
                    return ctx.session?.user?.id
                }
                return true
            })
            .map((item) => {
                const children = articles.filter((article) => article.group === item.identifier).map((article) => ({
                    slug: article.slug,
                    anchor: article.anchor,
                }));
                return {
                    ...item,
                    children,
                };
            });
        const dictionary = await getDict({ lang, key: 'page' });

        const menuDBurlTranslated = menuWithChildren.map((item) => {
            const { hasChildren, identifier, url, children, isPage } = item;
            const urlTranslated = translatePath({
                sourceLocale: i18n.appStructureLocale,
                targetLocale: lang,
                sourcePath: url,
            });
            return {
                hasChildren,
                identifier,
                isPage,
                url: urlTranslated,
                anchor: translate(dictionary, `page:${identifier}`),
                children: children.map(({ slug, anchor }) => {
                    return {
                        url: `${urlTranslated}/${slug}`,
                        anchor,
                    }
                })
            }
        });

        return menuDBurlTranslated;
    });

export default getMainMenu;