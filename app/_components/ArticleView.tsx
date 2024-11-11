import { type Article } from '@prisma/client';
import ImageFallback from './ImageFallback';
import MDXContent from './MDXContent';
import { type FunctionComponent } from 'react';
import LinkBox from './ui/LinkBox';
import { api } from '@root/app/trpc/server';

const ArticleView: FunctionComponent<{
    article: Article
}> = ({
    article
}) => {

        const {
            h1,
            coverImage,
            content,
            lang,
            group,
            key,
        } = article

        type LinkBoxProps = {
            label: string
            category: string
        }

        const LinkBoxWithData: FunctionComponent<LinkBoxProps> = async ({ label, category }) => {
            const links = await api.navigation.getArticlesLinks({
                lang: lang as LocaleApp,
                group,
                category,
                ignoreKeys: [key],
                limit: 10
            })
            return <LinkBox
                label={label}
                links={links}
            />
        }
        const components = {
            LinkBox: LinkBoxWithData
        };

        return (
            <>
                <section className="section pt-7">
                    <div className="container">
                        <div className="row justify-center">
                            <article className="lg:col-10">
                                {coverImage && (
                                    <div className="mb-10">
                                        <ImageFallback
                                            src={coverImage}
                                            height={500}
                                            width={1200}
                                            alt={h1}
                                            className="w-full rounded"
                                        />
                                    </div>
                                )}
                                <div className="content mb-10">
                                    <MDXContent<LinkBoxProps>
                                        content={content.join("")}
                                        components={components}
                                    />
                                </div>
                                <div className="row items-start justify-end">
                                </div>
                            </article>
                        </div>
                    </div >
                </section >
            </>
        );
    };

export default ArticleView;