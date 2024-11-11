import { env } from '@root/app/env';
import { i18n } from '@root/i18n-config';
import { z } from 'zod';

export const serpSimAiMetaTagsValidator = z
    .object({
        website: z.string().min(1, 'Serp-sim:general:form_error_website_required'),
        name: z.string().min(1, 'Serp-sim:general:form_error_name_required'),
        targetAudience: z.string().min(1, 'Serp-sim:general:form_error_target_audience_required'),
        localization: z.string().min(1, 'Serp-sim:general:form_error_localization_required'),
        language: z.string(),
        keywords: z.array(z.string()).min(3).default([]),
        languageUI: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
    })




