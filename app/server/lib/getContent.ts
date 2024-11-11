import { type PrismaClient } from '@prisma/client';
import { type MdContent, type Page } from '@prisma/client';
import { replaceVariables } from '@root/app/server/lib/replaceVariables';
import { type ContentContextType } from '@root/types';

function validateContext(context: unknown): context is ContentContextType {
    if (typeof context !== 'object' || context === null) {
        return false;
    }

    for (const [key, value] of Object.entries(context)) {
        if (typeof key !== 'string' || typeof value !== 'string') {
            return false;
        }
    }

    return true;
}

type ContentType = "page" | "mdContent";

export const getContent = async <T extends ContentType>(
    db: PrismaClient,
    { lang, key, contentType = "page" }: { lang: LocaleApp, key: string, contentType?: ContentType }
): Promise<(T extends "page" ? Page : MdContent) | null> => {
    const query = {
        where: {
            key,
            lang,
        }
    };

    let page: Page | MdContent | null = null;

    if (contentType === "mdContent") {
        page = await db.mdContent.findFirst(query);
    } else if (contentType === "page") {
        page = await db.page.findFirst(query);
    }

    if (!page) {
        return null;
    }

    const { content, context } = page;

    if (!validateContext(context)) {
        return page as T extends "page" ? Page : MdContent;
    }

    page.content = content.map(c => replaceVariables(c, { ...context }));

    return page as T extends "page" ? Page : MdContent;
};

export default getContent;
