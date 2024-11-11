import { type RoleType } from '@prisma/client';
import { env } from '@root/app/env';
import { getSetting } from '@root/app/server/cache/settings';
import { getTranslation } from '@root/app/server/cache/translations';

export const allowSignIn = async (roleId: RoleType, lang: LocaleApp = env.NEXT_PUBLIC_DEFAULT_LOCALE) => {
    const isAppActive = await getSetting<boolean>('app', "active");
    if (!isAppActive && roleId !== 'superAdmin') {
        const errorMessage = await getTranslation(lang, 'sign-up:app_is_not_active');
        throw new Error(errorMessage);
    }
    return true;
};

export default allowSignIn;