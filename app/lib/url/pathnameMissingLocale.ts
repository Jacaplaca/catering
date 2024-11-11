import { i18n } from '@root/i18n-config';

const pathnameMissingLocale = (pathname: string) => {
    return i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )
}

export default pathnameMissingLocale;