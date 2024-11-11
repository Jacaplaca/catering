import { env } from '@root/app/env';
import { i18n } from '@root/i18n-config';
import { z } from 'zod';

const backup = {
    url: z.string(),
    favicon: z.string().nullable(),
    name: z.string(),
    title: z.string(),
    description: z.string(),
    bolded: z.string(),
    showRating: z.boolean(),
    showDate: z.boolean(),
    showAds: z.boolean(),
}

export const backupSerpSimValidator = z
    .object({
        ...backup,
        lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
    })

export const backupSerpSimValidatorWithId = z
    .object({
        ...backup,
        id: z.string(),
    })



