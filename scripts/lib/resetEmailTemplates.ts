import { db } from '@root/app/server/db';
import getContent from '@root/scripts/lib/getContent';
import { type EmailTemplatePropsType } from '@root/types';

export const addNewEmailTemplates = async (emailTemplatesHDD: (EmailTemplatePropsType & {
    lang: string;
    key: string;
    context: Record<string, string>;
    content: string[];
    group: string;
})[]) => {
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

export const resetEmailTemplates = async ({ templateName, lang }: { templateName?: string, lang?: LocaleApp } = {}) => {
    const emailTemplatesHDD = getContent<EmailTemplatePropsType>('emailTemplate');

    await addNewEmailTemplates(emailTemplatesHDD);

    // Filter templates from HDD based on parameters
    let templatesHDDToUpdate = emailTemplatesHDD;
    if (templateName && lang) {
        templatesHDDToUpdate = templatesHDDToUpdate.filter(t => t.key === templateName && t.lang === lang);
    } else if (templateName) {
        templatesHDDToUpdate = templatesHDDToUpdate.filter(t => t.key === templateName);
    } else if (lang) {
        templatesHDDToUpdate = templatesHDDToUpdate.filter(t => t.lang === lang);
    }

    // Update/create templates
    for (const template of templatesHDDToUpdate) {
        const { group, ...data } = template;
        await db.emailTemplate.upsert({
            where: {
                key_lang: {
                    key: template.key,
                    lang: template.lang
                }
            },
            update: data,
            create: data
        });
    }
}