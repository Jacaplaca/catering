import { api } from "app/trpc/server";
import PageLayout from '@root/app/partials/PageLayout';
import ArticleView from '@root/app/_components/ArticleView';
import { type FunctionComponent } from 'react';
import { breadcrumbGen } from '@root/app/lib/schemaGen';
import { getContentFromApi } from '@root/app/lib/getContentFromApi';
import { type Page } from '@prisma/client';
import Page404 from '@root/app/_components/404';
import makeHref from '@root/app/lib/url/makeHref';

const ArticlePage: FunctionComponent<{
    lang: LocaleApp;
    slug: string;
    defaultPageName: string
}> = async ({ lang, slug, defaultPageName }) => {

    const article = await api.article.getOne({
        lang,
        group: defaultPageName,
        slug
    });

    if (!article) {
        return Page404({ lang });
    }

    const groupPage = await getContentFromApi({ lang, key: defaultPageName }) as Page;

    const { title, description, coverImage } = article;
    const schemaBreadcrumb = breadcrumbGen({ title, lang, page: defaultPageName, groupTitle: groupPage.title, slugs: [slug] });

    return (
        <PageLayout
            seoData={{
                title,
                description,
                image: coverImage,
                url: makeHref({ lang, page: defaultPageName, slugs: [slug] }, true),
                ogType: 'article'
            }}
            schemaBreadcrumb={schemaBreadcrumb}
            lang={lang}
        >
            <ArticleView
                article={article}
            />
        </PageLayout>
    );
};

export default ArticlePage;
