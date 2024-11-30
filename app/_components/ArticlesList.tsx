import { type FunctionComponent } from 'react';
import { i18n } from '@root/i18n-config'
// import BlogCard from './BlogCard';
// import Pagination from './Pagination';
// import { Post, SlugMap } from '../../types';
// import { getListPage, getSinglePage } from '../../lib/contentParser';
// import { sortByDate } from '../../lib/utils/sortFunctions';
// import PostSidebar from '../partials/PostSidebar';
// import { getAllTaxonomy, getTaxonomy } from '../../lib/taxonomyParser';
// import NotFound from '../../app/not-found';
import { type Article } from '@prisma/client';
import BlogCard from '@root/app/_components/BlogCard';
import translatePageName from '@root/app/lib/url/translatePageName';
// import Pagination from '@root/app/_components/ui/Pagination';
// const { pagination } = config.settings;

const ArticlesList: FunctionComponent<{
    group: string,
    params: { page: number, lang: LocaleApp }
    sidebar?: boolean
    pageDetails?: boolean
    articles: Article[]
    totalPages: number
    // slugs: SlugMap[string][string]
    // slugMap: SlugMap
    // seoData: {
    //     title?: string,
    //     meta_title?: string,
    //     description?: string,
    //     image: string,
    //     url: string

    // }
}> = ({
    group,
    // sidebar = false,
    pageDetails = false,
    params,
    // slugs,
    // slugMap,
    // totalPages,
    // seoData,
    articles
}) => {
        const { lang } = params;


        // const langSlugMap = slugMap[lang]
        // const slugs = langSlugMap[contentFolder]

        // const parentSlug = slugs["_index"].slug;
        // const parentSlug = group;
        // const parentSlugLang = isLangDefault ? parentSlug : `${lang}/${parentSlug}`

        // const folder = `${group}/${lang}`
        // const postIndex = getListPage(`${folder}/_index.md`);
        // if (!postIndex) {
        //     return (
        //         <NotFound params={{ lang }} />
        //     )
        // }
        // const { title, meta_title, description, image } = seoData;
        // const posts: Post[] = getSinglePage(folder);
        // const sortedPosts = sortByDate(posts);
        // const currentPage = page && !isNaN(Number(page)) ? Number(page) : 1;
        // const indexOfLastPost = currentPage * pagination;
        // const indexOfFirstPost = indexOfLastPost - pagination;
        // const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

        // const allCategories = getAllTaxonomy(folder, "categories");
        // const categories = getTaxonomy(folder, "categories");
        // const tags = getTaxonomy(folder, "tags");




        return (
            <>
                {translatePageName(i18n.appStructureLocale, lang, group)}
                <section className="section">
                    <div className="container flex flex-col items-center">
                        <div>
                            <div className='flex flex-row justify-between gap-12'>
                                <div className='flex flex-row gap-8 w-full flex-wrap'>
                                    {articles.map((post: Article, index: number) => (
                                        <div key={index} className="flex mb-14">
                                            <BlogCard
                                                group={group}
                                                data={post}
                                                showDetails={pageDetails}
                                                lang={lang}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {/* {sidebar ? <PostSidebar
                                    categories={categories}
                                    tags={tags}
                                    allCategories={allCategories}
                                /> : null} */}
                            </div>
                            {/* TODO Get pagination params like in catering users*/}
                            {/* <Pagination
                                lang={lang}
                                group={translatePageName(i18n.appStructureLocale, lang, group)}
                                // currentPage={currentPage}
                                // totalPages={totalPages}
                            // slugMap={slugMap}
                            /> */}
                        </div>
                    </div>
                </section>
            </>
        );
    };

export default ArticlesList;