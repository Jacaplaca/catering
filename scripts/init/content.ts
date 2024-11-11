import { PrismaClient } from "@prisma/client";
import { env } from '@root/app/env';
import getContent from '@root/scripts/lib/getContent';
import { type EmailTemplatePropsType, type ArticlePropsType, type PagePropsType } from '@root/types';
const db = new PrismaClient();

async function initContent<T extends "pages" | "articles" | 'mdContent' | 'emailTemplate'>(contentFolder: T) {

  if (contentFolder === "emailTemplate") {
    const emailTemplatesHDD = getContent<EmailTemplatePropsType>(contentFolder);
    if (env.RESET === 'yes') {
      await db.emailTemplate.deleteMany();
      await db.emailTemplate.createMany({
        data: emailTemplatesHDD.map((item) => {
          const { group, ...rest } = item;
          return rest;
        })
      });
    }
    const emailTemplatesDB = await db.emailTemplate.findMany();
    const freshArticles = emailTemplatesHDD.filter((item) => {
      const found = emailTemplatesDB.find((t) => t.key === item.key && t.lang === item.lang);
      return !found;
    });
    if (freshArticles.length > 0) {
      await db.emailTemplate.createMany({
        data: freshArticles.map((item) => {
          const { group, ...rest } = item;
          return rest;
        })
      });
    }
  }


  if (contentFolder === "articles") {
    const articlesHDD = getContent<ArticlePropsType>(contentFolder);
    if (articlesHDD?.length) {
      if (env.RESET === 'yes') {
        await db.article.deleteMany();
        await db.article.createMany({
          data: articlesHDD
        });
      }
      const articlesDB = await db.article.findMany();
      const freshArticles = articlesHDD.filter((item) => {
        const found = articlesDB.find((t) => t.key === item.key && t.lang === item.lang && t.group === item.group);
        return !found;
      });

      if (freshArticles.length > 0) {
        await db.article.createMany({
          data: freshArticles
        });
      }
    }
  }

  if (contentFolder === "pages") {
    const pagesHDD = getContent<PagePropsType>(contentFolder);
    let currentPages = await db.page.findMany();
    if (env.RESET === 'yes') {
      await db.page.deleteMany();
      currentPages = []
      await db.page.createMany({
        data: pagesHDD.map((item) => {
          const { group, ...rest } = item;
          return rest;
        })
      });
      await db.translation.deleteMany({
        where: {
          group: 'page'
        }
      })
    }

    // console.log("🚀 ~ currentPages:", currentPages.length)
    const freshPages = pagesHDD.filter((item) => {
      const found = currentPages.find((t) => t.key === item.key && t.lang === item.lang);
      return !found;
    });
    if (freshPages.length > 0) {
      await db.page.createMany({
        data: freshPages.map((item) => {
          const { group, ...rest } = item;
          return rest;
        })
      });
      await db.translation.createMany({
        data: freshPages.map((item) => {
          return {
            group: 'page',
            name: item.key,
            value: item.anchor,
            lang: item.lang
          }
        })
      });
    }
  }

  if (contentFolder === "mdContent") {
    const mdContentHDD = getContent(contentFolder);
    if (env.RESET === 'yes') {
      await db.mdContent.deleteMany();
      mdContentHDD.length && await db.mdContent.createMany({
        data: mdContentHDD.map((item) => {
          const { group, ...rest } = item;
          return rest;
        })
      });
    }
    const currentMdContent = await db.mdContent.findMany();
    const freshMdContent = mdContentHDD.filter((item) => {
      const found = currentMdContent.find((t) => t.key === item.key && t.lang === item.lang);
      return !found;
    });
    if (freshMdContent.length > 0) {
      await db.mdContent.createMany({
        data: freshMdContent
      });
    }
  }
}

export default initContent;