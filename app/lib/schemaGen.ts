import makeHref from '@root/app/lib/url/makeHref'
import { type Locale } from '@root/i18n-config'

const homePage = {
    'en': 'Home',
    'de': 'Startseite',
    'pl': 'Strona główna',
}

export const breadcrumbGen = ({ title, lang, page, groupTitle = "", slugs = [] }
    : { title: string, lang: Locale, page: string, groupTitle?: string, slugs?: string[] }) => {

    const itemList = [
        {
            title: homePage[lang],
            url: makeHref({ lang }, true)
        }
    ]

    if (page) {
        itemList.push({
            title: slugs.length ? groupTitle : title,
            url: makeHref({ lang, page }, true)
        })
    }

    if (slugs.length) {
        itemList.push({
            title,
            url: makeHref({ lang, page, slugs }, true)
        })
    }

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": itemList.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.title,
            "item": {
                "@type": "WebPage",
                "@id": item.url
            }
        }))
    }
}
