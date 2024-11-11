import { env } from '@root/app/env';
import { i18n } from '@root/i18n-config';
import { z } from 'zod';

const password = z
    .string()
    // .min(1, 'Password is required')
    .min(1, "auth-validators-errors:password_required")

const email = z.string().min(1, 'email_required').email('auth-validators-errors:email_invalid');

export const userCreateValidator = z
    .object({
        lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
        email,
        password,
        confirmPassword: z.string().min(1, "auth-validators-errors:password_required"),
        inviteToken: z.string().nullable()
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'auth-validators-errors:password_confirmation',
    });

export const loginValidator = z.object({
    email,
    password,
});

export const resetPasswordValidator = z.object({
    email,
    lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
});

export const changeEmailValidator = z.object({
    email,
    lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
});

export const web3AddressValidator = z.object({
    signedMessage: z.string().min(1, 'web3:signing_message'),
    lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
});

export const createNewPasswordValidator = z.object({
    lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
    token: z.string().optional(),
    password,
    confirmPassword: password,
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'auth-validators-errors:password_confirmation',
});

export const paginationValidator = z.object({
    group: z.string().optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).default(10),
    lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
});

export const mainMenuValidator = z.object({
    lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
});

export const getSerpSim = z.object({
    engineName: z.string().optional(),
})

export const getUsers = z.object({
    limit: z.number().int().min(1).default(10),
    page: z.number().int().min(1).default(1),
    sortName: z.enum(['name', 'email']).optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    role: z.enum(['all', 'superAdmin', 'manager', 'client', 'dietician', 'kitchen']).optional(),
    searchValue: z.string().optional(),
});

export const getUsersCount = z.object({
    role: z.enum(['all', 'superAdmin', 'manager', 'client', 'dietician', 'kitchen']).optional(),
    searchValue: z.string().optional(),
});

export const removeUsers = z
    .object({
        ids: z.array(z.string()),
    })
