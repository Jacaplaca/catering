'use client';
import makeHref from '@root/app/lib/url/makeHref';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
const SignOutComponent: React.FC<{ lang: LocaleApp }> = ({ lang }) => {
    const redirect = async () => {
        await signOut({
            redirect: true,
            callbackUrl: makeHref({ lang, page: '/' })
        })
    }

    useEffect(() => {
        void redirect();
    }, []);

    return null;
};


export default SignOutComponent;
