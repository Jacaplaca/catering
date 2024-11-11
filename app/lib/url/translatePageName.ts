import pageNameTrans from '@root/app/assets/pageNameTranslation'
import { type Locale } from '@root/i18n-config'

const translatePageName = (sourceLocale: Locale, targetLocale: Locale, sourcePageName: string) => {
    const pathnamesDict = pageNameTrans[sourceLocale]
    const defaultPageName = pathnamesDict[sourcePageName]
    if (defaultPageName) {
        const targetPathnamesDict = pageNameTrans[targetLocale]
        const counterpart = Object.entries(targetPathnamesDict).find(([_, value]) => value === defaultPageName)
        if (counterpart) {
            return counterpart[0]
        }
    }
    return sourcePageName
}

export default translatePageName;