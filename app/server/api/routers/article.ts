import {
    superAdminProcedure,
    publicProcedure,
} from "server/api/trpc";
import { paginationValidator } from '@root/app/validators/user';
import { faker } from '@faker-js/faker';
import { i18n, type Locale } from '@root/i18n-config'
import { type Article } from '@prisma/client';
import generateSitemap from '@root/scripts/init/generate-sitemap';
import { articleValidator, generateArticles, getOneArticleValidator, groupArticlesCountValidator } from '@root/app/validators/article';
import getCurrentTime from '@root/app/lib/date/getCurrentTime';

export const articleRouter = {
    getLangsSlugs: publicProcedure.input(getOneArticleValidator)
        .query(async ({ ctx, input }) => {
            const { slug, lang, group } = input;

            if (!slug || !lang || !group) {
                return {};
            }

            const currentArticle = await ctx.db.article.findFirst({
                where: {
                    slug: decodeURIComponent(slug),
                    lang,
                    group,
                }
            });
            if (!currentArticle) {
                return {};
            }
            const { key } = currentArticle;
            const articles = await ctx.db.article.findMany({
                where: {
                    group,
                    key,
                }
            });
            const langToSlug: Record<Locale, string> = articles.reduce((acc, article) => {
                const { lang, slug } = article;
                return {
                    ...acc,
                    [lang]: slug,
                }
            }, {} as Record<Locale, string>);
            return langToSlug;
        }),
    count: publicProcedure
        .input(groupArticlesCountValidator)
        .query(({ ctx, input }) => {
            const { group, lang } = input;
            return ctx.db.article.count({
                where: {
                    group,
                    lang,
                }
            });
        }),
    getOne: publicProcedure
        .input(getOneArticleValidator)
        .query(({ ctx, input }) => {
            const { slug, lang, group } = input;
            return ctx.db.article.findFirst({
                where: {
                    slug: decodeURIComponent(slug),
                    lang,
                    group,
                }
            });
        }),
    getLatest: publicProcedure
        .input(paginationValidator)
        .query(({ ctx, input }) => {
            const { group, lang, limit, page } = input;
            const offset = (page - 1) * limit;
            return ctx.db.article.findMany({
                take: limit,
                skip: offset,
                orderBy: { createdAt: "desc" },
                where: {
                    group,
                    lang,
                }
            });
        }),
    removeFakeArticles: superAdminProcedure.mutation(async ({ ctx }) => {
        const removed = await ctx.db.article.deleteMany({
            where: {
                fake: true
            }
        });
        await generateSitemap();
        return removed;
    }),
    generateFakeArticles: superAdminProcedure.input(generateArticles).
        mutation(async ({ ctx, input }) => {
            const { count } = input;
            const keys = Array.from({ length: count }, () => faker.string.alpha({ length: 5, casing: 'lower' }));
            const groups = ['seo-guide'];
            const languages = i18n.locales;
            const authors = Array.from({ length: 2 }, () => faker.person.firstName());
            const categories = Array.from({ length: 7 }, () => faker.lorem.word());
            const tags = Array.from({ length: 7 }, () => faker.lorem.word());

            const articles: Omit<Article, "id" | 'createdAt' | 'updatedAt'>[] = []
            keys.forEach((key) => {
                const group = faker.helpers.arrayElement(groups);
                const categoriesCount = faker.number.int({ min: 0, max: 3 });
                const tagsCount = faker.number.int({ min: 0, max: 3 });
                const coverImage = faker.image.url();
                const author = faker.helpers.arrayElement(authors);
                const date = faker.date.between({
                    from: new Date(2020, 0, 1),
                    to: getCurrentTime(),
                })
                const addLang = (lang: string, str: string) => `[${lang}]_${str}`
                languages.forEach((lang) => {
                    const article = {
                        title: addLang(lang, faker.lorem.sentence()),
                        h1: addLang(lang, faker.lorem.sentence()),
                        description: addLang(lang, faker.lorem.sentence()),
                        anchor: addLang(lang, faker.lorem.slug()),
                        slug: addLang(lang, faker.lorem.slug()),
                        lead: addLang(lang, faker.lorem.paragraph()),
                        content: [addLang(lang, faker.lorem.paragraphs())],
                        context: {},
                        lang,
                        author,
                        date,
                        key,
                        group,
                        categories: faker.helpers.arrayElements(categories, categoriesCount),
                        tags: faker.helpers.arrayElements(tags, tagsCount),
                        coverImage,
                        fake: true,
                    };
                    articles.push(article);
                });
            });
            const newArts = await ctx.db.article.createMany({
                data: articles
            });
            await generateSitemap();
            return newArts;

        }),
    add: superAdminProcedure
        .input(articleValidator)
        .mutation(async ({ ctx, input }) => {
            const { title, description, h1, slug, anchor, content, lead, lang, image, author, key, group, categories, tags } = input;

            const newArt = await ctx.db.article.create({
                data: {
                    title,
                    description,
                    h1,
                    anchor,
                    slug,
                    lead,
                    content: [content],
                    lang,
                    author,
                    date: getCurrentTime(),
                    key,
                    group,
                    categories: categories ? categories.toLowerCase().trim().split(',') : [],
                    tags: tags ? tags.toLowerCase().trim().split(',') : [],
                    coverImage: image,

                }
            });
            await generateSitemap();
            return newArt;
        }),
};