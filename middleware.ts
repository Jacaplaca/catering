import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n, type Locale } from '@root/i18n-config'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import pageNameTrans from '@root/app/assets/pageNameTranslation'
import { env } from '@root/app/env'
import splitPathname from '@root/app/lib/url/splitPathname'
import { s3getPresign } from '@root/app/server/s3/presign'
import makeHref from '@root/app/lib/url/makeHref'

// const appStructureLocale = 'en' as string
function getLocale(request: NextRequest) {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const locales = i18n.locales as unknown as string[]

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  )

  const locale = matchLocale(languages, locales, env.DEFAULT_LOCALE) as Locale

  return locale || env.DEFAULT_LOCALE
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const { langPath, page, rest } = splitPathname(pathname)
  const theBestLocale = getLocale(request)

  const url = request.nextUrl.clone();

  //handle file page for s3 bucket files
  if (page === 'file') {
    const s3UrlObj = await s3getPresign([rest.join('/')]);
    if (s3UrlObj[0]?.url) {
      const url = new URL(s3UrlObj[0].url);
      return NextResponse.rewrite(url);
    }
    return NextResponse.rewrite(new URL('/images/image-placeholder.png', request.url));
  }

  if (pathname === "/") {
    const isBestEqualDefault = theBestLocale === env.DEFAULT_LOCALE
    if (isBestEqualDefault) {
      url.pathname = `/${langPath}`
      return NextResponse.rewrite(url)
    }
    return NextResponse.redirect(
      new URL(
        // this occur when the lang is the default lang, especially when we have only one lang
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `/${theBestLocale}`,
        request.url
      )
    )
  }

  if (!page && langPath === theBestLocale && theBestLocale === env.DEFAULT_LOCALE) {
    return NextResponse.redirect(
      new URL(
        `/`,
        request.url
      )
    )
  }


  if (page) {
    const defaultPage = pageNameTrans[langPath][page] ?? page ?? '404'
    url.pathname = `/${langPath}/${defaultPage}${rest ? `/${rest.join("/")}` : ''}`
    return NextResponse.rewrite(url)
  }

}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|images).*)'],
}
