import { env } from '@root/app/env';
import { i18n } from '@root/i18n-config';
import { z } from 'zod';


export const contactFormValidator = z
    .object({
        email: z.string().min(1, 'form-error-email-required').email('form-error-email'),
        message: z.string().min(1, 'form-error-to-long'),
        lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
    })




