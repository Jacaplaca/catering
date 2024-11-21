import { ClipboardKey } from '@prisma/client';
import { env } from '@root/app/env';
import { i18n } from '@root/i18n-config';
import { z } from 'zod';

export const TableTypeValues = Object.values(ClipboardKey) as [ClipboardKey, ...ClipboardKey[]];

export const getSettingsGroupValidator = z.object({
    group: z.string(),
    module: z.string().optional(),
})

export const getTableColumnsValid = z.object({
    key: z.enum(TableTypeValues),
})

export const updateTableColumnsValid = z.object({
    key: z.enum(TableTypeValues),
    columns: z.array(z.string()),
})

export const updateEmailSettingsValid = z.object({
    contactAdmin: z.string(),
    from: z.string(),
    fromAlias: z.string(),
    fromActivation: z.string(),
    host: z.string(),
    password: z.string(),
    // port: z.number(),
    port: z.preprocess((val) => Number(val), z.number().int().positive()),
    templateHtmlWrapper: z.string(),
    username: z.string(),
    lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
    invitationValiditySec: z.preprocess((val) => Number(val), z.number().int().positive()),
    confirmSignupByEmailValiditySec: z.preprocess((val) => Number(val), z.number().int().positive()),
    // resetPasswordValiditySec: z.number(),
    // confirmNewEmailValiditySec: z.number(),

})
