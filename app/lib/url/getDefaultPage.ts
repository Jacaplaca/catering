import { type Locale } from '@root/i18n-config'
import pageNameTrans from '@root/app/assets/pageNameTranslation'

const getDefaultPage = (locale: Locale, pageName: string) => {
    const pathnamesDict = pageNameTrans[locale]
    if (!pathnamesDict) {
        return ""
    }
    const counterpart = pathnamesDict[pageName]
    if (counterpart) {
        return counterpart
    }
    return pageName
}

export default getDefaultPage;