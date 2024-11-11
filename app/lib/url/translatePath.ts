
import { type Locale } from '@root/i18n-config'
import { env } from '@root/app/env'
import splitPathname from '@root/app/lib/url/splitPathname'
import translatePageName from '@root/app/lib/url/translatePageName'

const translatePath = ({
    sourceLocale,
    targetLocale,
    sourcePath,
    slugs,
    forceLang
}: {
    sourceLocale: Locale,
    targetLocale: Locale,
    sourcePath: string,
    slugs?: Record<string, string>,
    forceLang?: boolean
}): string => {

    const removeTrailingSlash = (str: string): string => {
        if (str.length > 1 && str.endsWith('/')) {
            return str.slice(0, -1);
        }
        return str;
    }

    const isTargetLocaleDefault = targetLocale === env.NEXT_PUBLIC_DEFAULT_LOCALE
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    let newUrl = isTargetLocaleDefault ? "/" : `/${targetLocale}/`
    const { langPath, page, rest } = splitPathname(sourcePath)

    if (forceLang && (sourcePath === "/" || sourcePath === `/${langPath}`)) {
        return `/${targetLocale}`
    }

    if (!page) {
        return removeTrailingSlash(newUrl)
    }

    const pageTranslated = translatePageName(sourceLocale, targetLocale, page)
    if (!pageTranslated) {
        return `/${targetLocale}/404`
    }

    newUrl = newUrl + pageTranslated
    if (!rest[0]) {
        return newUrl;
    }

    const slugTranslated = slugs?.[targetLocale] ?? rest[0]
    if (!slugTranslated) {
        return newUrl
    }
    return newUrl + `/${slugTranslated}`
}

export default translatePath;