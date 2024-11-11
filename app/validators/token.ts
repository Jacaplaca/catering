import { env } from '@root/app/env';
import { i18n } from '@root/i18n-config';
import { z } from 'zod';

export const getInviteTokenDetailsValidator = z
    .object({
        token: z.string().min(1, 'invite:form-error-token-invalid'),
        lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
    })

export const sendInviteValidator = z
    .object({
        lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
        role: z.string().min(1, 'invite:form_role_required'),
        email: z.string().min(1, 'invite:form_email_required').email('invite:form_email_invalid'),
        sendEmail: z.boolean().default(false),
    })