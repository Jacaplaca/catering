import { PrismaClient } from "@prisma/client";
import { env } from '@root/app/env';
const db = new PrismaClient();

const defaultMainMenu = [
    {
        url: '/about',
        identifier: 'about',
        hasChildren: false,
        order: 2,
        isPage: true,
        loginRequired: false,
    },
    {
        url: '/dashboard',
        identifier: 'dashboard',
        hasChildren: false,
        order: 3,
        isPage: true,
        loginRequired: true,
    },
]

async function initMainMenu() {
    if (env.RESET === 'yes') {
        await db.mainMenu.deleteMany({});
    }
    const mainMenu = await db.mainMenu.findMany();
    if (mainMenu.length === 0) {
        await db.mainMenu.createMany({
            data: defaultMainMenu
        })
    }
}

export default initMainMenu;