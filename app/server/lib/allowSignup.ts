import { type PrismaClient } from '@prisma/client';
import { env } from '@root/app/env';
import { getSetting } from '@root/app/server/cache/settings';
import { getTranslation } from '@root/app/server/cache/translations';

const allowSignup = async (db: PrismaClient, lang: LocaleApp = env.NEXT_PUBLIC_DEFAULT_LOCALE) => {
    const usersCount = await db.user.count();
    const isAppActive = await getSetting<boolean>('app', "active");
    if (!isAppActive && usersCount > 0) {
        const errorMessage = await getTranslation(lang, 'sign-up:app_is_not_active');
        throw new Error(errorMessage);
    }
}

export default allowSignup;