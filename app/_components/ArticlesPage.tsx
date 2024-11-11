import { api } from "app/trpc/server";
import ArticlesList from '@root/app/_components/ArticlesList';
import PageLayout from '@root/app/partials/PageLayout';
import { type FunctionComponent } from 'react';
import { getContentFromApi } from '@root/app/lib/getContentFromApi';
import { breadcrumbGen } from '@root/app/lib/schemaGen';
import { type Page } from '@prisma/client';
import Page404 from '@root/app/_components/404';
import makeHref from '@root/app/lib/url/makeHref';

const ArticlesPage: FunctionComponent<{
    lang: LocaleApp;
    pageNo?: string;
    defaultPageName: string
}> = async ({ lang, pageNo = "1", defaultPageName }) => {

    const pageFromApi = await getContentFromApi({ lang, key: defaultPageName })

    const { title, description, h1 } = pageFromApi as Page;
    const schemaBreadcrumb = breadcrumbGen({ title, lang, page: defaultPageName });

    const page = parseInt(pageNo);

    const seoData = {
        title,
        description,
        image: "",
        url: makeHref({ lang, page: defaultPageName }, true),
    }

    const limit = 10;

    const totalCount = await api.article.count({
        lang,
        group: defaultPageName
    });

    if ((page - 1) > (totalCount / limit) || page < 1) {
        return Page404({ lang });
    }

    const articles = await api.article.getLatest({
        page,
        limit,
        lang,
        group: defaultPageName
    });

    return (
        <PageLayout
            h1={h1}
            seoData={seoData}
            schemaData={schemaBreadcrumb}
            lang={lang}
        >
            <ArticlesList
                params={{ lang, page }}
                group={defaultPageName}
                articles={articles}
                // seoData={seoData}
                totalPages={Math.ceil(totalCount / limit)}
            />
        </PageLayout>
    );
};

export default ArticlesPage;
