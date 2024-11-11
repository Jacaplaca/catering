import { env } from '@root/app/env';
import { i18n } from '@root/i18n-config';
import { z } from 'zod';

export const getTranslationsValidator = z.object({
    // group: z.string().optional(),
    // withShared: z.boolean().optional(),
    lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
    keys: z.array(z.string()).optional(),
    key: z.string().optional(),
})

export const getOneTranslationValidator = z.object({
    group: z.string(),
    lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
    name: z.string(),
})

