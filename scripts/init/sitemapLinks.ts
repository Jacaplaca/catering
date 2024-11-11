import { PrismaClient } from "@prisma/client";
import { env } from '@root/app/env';
const db = new PrismaClient();

const defaultSiteMaps = [
    {
        url: '/',
        identifier: 'home',
        hasChildren: false,
        priority: 0.8,
    },
    {
        url: '/sign-in',
        identifier: 'sign-in',
        hasChildren: false,
        priority: 0.8,
    },
    {
        url: '/sign-up',
        identifier: 'sign-up',
        hasChildren: false,
        priority: 0.8,
    },
    {
        url: '/about',
        identifier: 'about',
        hasChildren: false,
        priority: 0.8,
    },
    {
        url: '/contact',
        identifier: 'contact',
        hasChildren: false,
        priority: 0.8,
    },
]

async function initSitemapLinks() {
    await db.sitemap.deleteMany({});
    await db.sitemap.createMany({
        data: defaultSiteMaps
    });
}

export default initSitemapLinks;