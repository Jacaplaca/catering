import { i18n } from '@root/i18n-config'
import translatePath from '@root/app/lib/url/translatePath'

const getMainPageUrl = (lang: LocaleApp) => translatePath({
    sourceLocale: i18n.appStructureLocale,
    targetLocale: lang,
    sourcePath: "/",
    forceLang: true,
})

export default getMainPageUrl;