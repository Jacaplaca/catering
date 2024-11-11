import { env } from '@root/app/env';
import { i18n } from '@root/i18n-config';
import { z } from 'zod';

export const getArticlesLinksValidator = z.object({
    lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
    group: z.string().optional(),
    category: z.string().optional(),
    ignoreKeys: z.array(z.string()).optional(),
    limit: z.number().int().min(1).optional(),
});

export const groupArticlesCountValidator = z.object({
    group: z.string().optional(),
    lang: z.enum(i18n.locales).default(env.NEXT_PUBLIC_DEFAULT_LOCALE),
});

export const generateArticles = z.object({
    count: z.number().int().min(1).default(1),
});

export const articleValidator = z.object({
    title: z.string().min(1, 'Title is required'),
    h1: z.string().min(1, 'Meta title is required'),
    description: z.string().min(1, 'Meta description is required'),
    anchor: z.string().min(1, 'Anchor is required'),
    slug: z.string().min(1, 'Slug is required'),
    lead: z.string().min(1, 'Lead is required'),
    content: z.string().min(1, 'Content is required'),
    lang: z.string().min(1, 'Language is required'),
    image: z.string().min(1, 'Image URL is required'),
    author: z.string().min(1, 'Author is required'),
    // date: z.date(),
    key: z.string().min(1, 'Key is required'),
    group: z.string().min(1, 'Group is required'),
    categories: z.string().optional(),
    tags: z.string().optional(),
});

export const getOneArticleValidator = z.object({
    slug: z.string().min(1, 'Slug is required'),
    lang: z.string().min(1, 'Language is required'),
    group: z.string().min(1, 'Group is required'),
});