import translate from '@root/app/lib/lang/translate';
import makeHref from '@root/app/lib/url/makeHref';
import translatePath from '@root/app/lib/url/translatePath';
import { publicProcedure } from '@root/app/server/api/trpc';
import { getSetting } from '@root/app/server/cache/settings';
import { getDict } from '@root/app/server/cache/translations';
import { mainMenuValidator } from '@root/app/validators/user';
import { i18n } from '@root/i18n-config';
import { type FooterData } from '@root/types';

const getFooter = publicProcedure
    .input(mainMenuValidator)
    .query(async ({ input }) => {
        const { lang } = input;

        const dictionary = await getDict({ lang, keys: ['page', 'Footer'] });

        const footer = await getSetting<FooterData>('navigation', 'footer');

        type FooterElement = {
            label: string;
            links: {
                url: string;
                id: string;
                label: string;
                noTranslate?: boolean;
            }[];
        };

        const translated = {
            company: {
                label: translate(dictionary, `Footer:company_label`) ?? "",
                links: footer.company.links.map((link) => ({
                    ...link,
                    label: translate(dictionary, `page:${link.id}`) ?? link.id,
                    url: link.noTranslate ? makeHref({ page: link.url }, true)
                        : translatePath({
                            sourceLocale: i18n.appStructureLocale,
                            targetLocale: lang,
                            sourcePath: link.url,
                        }),
                })),
            },
        } as {
            company: FooterElement;
            content?: FooterElement;
        }

        if (footer.content?.links?.length) {
            translated.content = {
                label: translate(dictionary, `Footer:content_label`) ?? "",
                links: footer.content.links.map((link) => ({
                    ...link,
                    label: translate(dictionary, `page:${link.id}`) ?? link.id,
                    url: translatePath({
                        sourceLocale: i18n.appStructureLocale,
                        targetLocale: lang,
                        sourcePath: link.url,
                    }),
                })),
            };
        }

        return translated;

    });

export default getFooter;