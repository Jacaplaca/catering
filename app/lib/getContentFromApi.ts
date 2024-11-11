import { type MdContent, type Page } from '@prisma/client';
import { api } from "app/trpc/server";

type ContentType = "page" | "mdContent";
export const getContentFromApi = async <T extends ContentType>({ lang, key, contentType = "page" }: { lang: LocaleApp, key: string, contentType?: "page" | 'mdContent' }): Promise<T extends "page" ? Page : MdContent> => {
    const page = await api[contentType].get({
        lang,
        key,
    }) ?? { content: [], context: {} }
    // if (!page) {
    //     throw new Error(`Page not found: ${key}`);
    // }
    // const { content, context } = page;
    // if (!validateContext(context)) {
    //     return page as T extends "page" ? Page : MdContent;
    // }

    // page.content = content.map(c => replaceVariables(c, { ...context }));
    return page as T extends "page" ? Page : MdContent;
};
