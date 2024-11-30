import { defaultPages } from '@root/app/assets/pageNameTranslation';
import { env } from '@root/app/env';
import makeHref from '@root/app/lib/url/makeHref'
import { signOut } from 'next-auth/react'

const mainPageRedirect = env.NEXT_PUBLIC_MAIN_PAGE_REDIRECT;

const signOutWithRedirect = async (lang: LocaleApp) => {
    await signOut({
        redirect: true,
        callbackUrl: makeHref({ lang, page: mainPageRedirect ? defaultPages.signIn : '/' })
    })
}

export default signOutWithRedirect;