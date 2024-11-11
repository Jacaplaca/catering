import { env } from '@root/app/env';
import { i18n } from '@root/i18n-config';
import { z } from 'zod';


export const getPageValidator = z
    .object({
        lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
        key: z.string(),
    })




