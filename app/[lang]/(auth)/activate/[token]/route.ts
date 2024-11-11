import { removeExpiredConfirmationSignupByEmailTokens } from '@root/app/lib/removeExpiredTokens';
import makeHref from '@root/app/lib/url/makeHref';
import assignAutoRoleDuringConfirmation from '@root/app/server/lib/roles/assignAutoRoleDuringConfirmation';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server'
import { db } from "server/db";

type RouteProps = {
    params: Promise<{
        token: string;
        lang: LocaleApp;
    }>;
}

export async function GET(
    request: NextRequest,
    props: RouteProps
) {
    const params = await props.params;
    const { token, lang } = params;
    const signInPage = 'sign-in'


    const tokenExists = await db.activationToken.findUnique({
        where: {
            token: token.toLowerCase().trim(),
            expires: {
                gt: new Date()
            }
        },
    });

    if (!tokenExists) {
        const url = makeHref({ lang, page: signInPage, params: new URLSearchParams({ tokenNotFound: "true" }) });
        return redirect(url);
    }

    await db.activationToken.delete({
        where: {
            token: token.toLowerCase().trim()
        }
    })

    await removeExpiredConfirmationSignupByEmailTokens()

    const user = await db.user.update({
        where: {
            email: tokenExists.identifier
        },
        data: {
            emailVerified: new Date()
        }
    })

    await assignAutoRoleDuringConfirmation(user.id);
    const url = makeHref({ lang, page: signInPage, params: new URLSearchParams({ emailVerified: "true" }) });
    return redirect(url);
}