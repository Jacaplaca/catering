import MDXContent from '@root/app/_components/MDXContent';
import SignInForm from '@root/app/_components/form/SignInForm';
import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import { auth } from '@root/app/server/auth';
import { type FunctionComponent } from 'react';

const SignInView: FunctionComponent<{
    lang: LocaleApp;
    redirectUrl: string;
    content?: string;
}> = async ({ lang, redirectUrl, content }) => {
    const dictionary = await getDictFromApi(lang, ["sign-in", 'shared'])
    const session = await auth()

    return (
        <SignInForm
            dictionary={dictionary}
            lang={lang}
            redirectUrl={redirectUrl}
            session={session}
        >
            {content ? <MDXContent
                content={content}
                className="info-form" />
                : null}
        </SignInForm>
    );
};

export default SignInView;