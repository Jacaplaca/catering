import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

import { SitemapStream, streamToPromise } from 'sitemap';
import { promises as fs, createWriteStream } from 'fs';
import path from 'path';
import { type Locale, i18n } from '@root/i18n-config';
import translatePath from '@root/app/lib/url/translatePath';

function ensureSingleSlash(inputString: string): string {
  const modifiedString = inputString.replace(/^\/+/g, '');
  return '/' + modifiedString;
}

const getElement = (item: {
  url: string;
  identifier: string;
  hasChildren: boolean;
}, lang: Locale, articles: {
  slug: string;
  title: string;
  lang: string;
  group: string;
  key: string;
}[]): {
  url: string, alternate: {
    lang: string;
    url: string;
  }[],
  children: {
    url: string, alternate: {
      lang: string;
      url: string;
    }[]
  }[] | null
} => {
  const { url, identifier, hasChildren } = item;
  let newUrl = translatePath({ sourceLocale: i18n.appStructureLocale, targetLocale: lang, sourcePath: url })
  newUrl = ensureSingleSlash(newUrl)
  let children: null | {
    url: string, alternate: {
      lang: string;
      url: string;
    }[]
  }[] = null
  if (hasChildren) {
    const articlesFromGroup = articles.filter(article => article.group === identifier)
    const slugsByKeysAndLanguage = articlesFromGroup.reduce((acc, article) => {
      const { key, lang, slug } = article;
      if (!acc[key]) {
        acc[key] = { [lang]: slug };
      } else {
        acc[key] = { ...acc[key], [lang]: slug };
      }
      return acc;
    }, {} as Record<string, Record<string, string>>);

    children = Object.entries(slugsByKeysAndLanguage).map(([key, slugs]) => {
      const language: string = lang;
      const urlWithSlug = `${newUrl}/${slugs[language]}`;
      const alternate = i18n.locales.filter(localeLang => localeLang !== lang).map(localeLang => {
        const url = translatePath({ sourceLocale: lang, targetLocale: localeLang, sourcePath: urlWithSlug, slugs: slugsByKeysAndLanguage[key] })
        return { lang: localeLang, url: ensureSingleSlash(url) }
      })
      return { url: urlWithSlug, alternate };
    })

  }
  const alternate = i18n.locales.filter(localeLang => localeLang !== lang).map(localeLang => {
    const url = translatePath({ sourceLocale: lang, targetLocale: localeLang, sourcePath: newUrl })
    return { lang: localeLang, url: ensureSingleSlash(url) }
  })
  return { url: newUrl, alternate, children }
}

const generateSitemap = async () => {
  const sitemapsLinks = await db.sitemap.findMany();
  const articles = await db.article.findMany();
  console.log({ sitemapsLinks: sitemapsLinks.length, articles: articles.length })
  const sitemapPath = path.resolve('./public/sitemap.xml');

  const stream = new SitemapStream({ hostname: process.env.DOMAIN });

  i18n.locales.forEach((lang) => {
    sitemapsLinks.forEach((item) => {
      const { priority, hasChildren } = item
      const { url, alternate, children } = getElement(item, lang, articles)
      stream.write({
        url, changefreq: 'daily', priority, links: alternate,
      });
      if (hasChildren && children?.length) {
        children.forEach(({ url, alternate }) => {
          stream.write({ url, changefreq: 'daily', priority, links: alternate })
        })
      }
    });
  });

  stream.end();



  await streamToPromise(stream).then(sm => {
    const sitemap = sm.toString()
    console.log("🚀 ~ awaitstreamToPromise ~ sitemap:", sitemap.length)
    createWriteStream(sitemapPath).write(sitemap)
  });

};

export default generateSitemap;

