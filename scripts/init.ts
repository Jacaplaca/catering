import { PrismaClient } from '@prisma/client'
import initSettings from '@root/scripts/init/settings'
import generateSitemap from '@root/scripts/init/generate-sitemap'
import initLang from '@root/scripts/init/lang'
import initMainMenu from '@root/scripts/init/mainMenu'
import { initContent } from '@root/scripts/init/content'
import initSitemapLinks from '@root/scripts/init/sitemapLinks'
import initRoles from '@root/scripts/init/roles'
import initFooter from '@root/scripts/init/footer'
import initDashboard from '@root/scripts/init/dashboard'
import * as dotenv from 'dotenv';
dotenv.config();

const db = new PrismaClient();

const init = async (allowWhenEmpty = false) => {
    const cantInit = allowWhenEmpty ? await db.setting.findFirst() : false;
    if (!cantInit) {
        console.log('init')
        await initSettings()
        await initLang()
        await initRoles()
        await initMainMenu()
        await initFooter()
        await initDashboard()
        await initContent('pages')
        await initContent('articles')
        await initContent('mdContent')
        await initContent('emailTemplate')
        await initSitemapLinks()
        await generateSitemap()
    }
}

// void init()

export default init