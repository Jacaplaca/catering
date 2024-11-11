import Link from "next/link";
import ImageFallback from "./ImageFallback";
import { type FunctionComponent } from 'react';
import { type Article } from '@prisma/client';
import { humanize, plainify, slugify } from '@root/app/lib/textConverter';
import dateFormat from '@root/app/lib/dateFormat';
import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import makeHref from '@root/app/lib/url/makeHref';
import translate from '@root/app/lib/lang/translate';

const BlogCard: FunctionComponent<{
  data: Article, group: string, showDetails?: boolean, lang: LocaleApp
}> = async ({ data, group, showDetails, lang }) => {
  // const pageName = translatePageName(i18n.appStructureLocale, lang, group)
  // const { summary_length } = config.settings;
  const { title, coverImage, author, categories, date, lead, slug } = data;
  // const href = `/${lang}/${pageName}/${data.slug}`;
  const href = makeHref({ lang, page: group, slugs: [slug] })
  const dictionary = await getDictFromApi(lang, 'articles-list')
  return (
    <div className="bg-body dark:bg-darkmode-body">
      {coverImage && (
        <ImageFallback
          className="mb-6 w-full rounded"
          src={coverImage}
          alt={title}
          width={445}
          height={230}
        />
      )}
      <h4 className="mb-3">
        <Link href={href}>{title}</Link>
        {/* aaaa: {group} {lang} {pageName} */}
      </h4>
      {showDetails ? <ul className="mb-4">
        <li className="mr-4 inline-block">
          <a href={`/authors/${slugify(author)}`}>
            <i className="fa-regular fa-circle-user -mt-1 mr-2 inline-block"></i>
            {humanize(author)}
          </a>
        </li>
        <li className="mr-4 inline-block">
          <i className="fa-regular fa-folder -mt-1 mr-2 inline-block"></i>
          {categories?.map((category: string, index: number) => (
            <Link key={index} href={`/categories/${slugify(category)}`}>
              {humanize(category)}
              {index !== categories.length - 1 && ", "}
            </Link>
          ))}
        </li>
        {date && <li className="inline-block">{dateFormat(date)}</li>}
      </ul> : null}
      <p className="mb-6">
        {plainify(lead)}
      </p>
      <Link
        className="btn btn-outline-primary btn-sm"
        href={href}
      >
        {translate(dictionary, 'readMore')}
      </Link>
    </div>
  );
};

export default BlogCard;
