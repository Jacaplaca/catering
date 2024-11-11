import pathnameMissingLocale from '@root/app/lib/url/pathnameMissingLocale';
import { type Locale } from '@root/i18n-config'
import { env } from '@root/app/env'

const splitPathname = (pathname: string) => {
    const isPathnameMissingLocale = pathnameMissingLocale(pathname)
    const pathModded = isPathnameMissingLocale ? `/${env.NEXT_PUBLIC_DEFAULT_LOCALE}${pathname}` : pathname
    const pathNameParts = pathModded.split('/');
    const langPath = pathNameParts[1]
    const page = pathNameParts[2] ?? ""
    const rest = pathNameParts.slice(3)
    return { langPath, page, rest } as { langPath: Locale, page: string | undefined, rest: string[] }
}

export default splitPathname
