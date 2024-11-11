import { type Session } from 'next-auth';
import { type FunctionComponent } from 'react'
import CreateNewPasswordForm from '@root/app/_components/form/CreateNewPassword';
import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import getSettingsFromApi from '@root/app/lib/settings/getSettingsFromApi';

const NewPassword: FunctionComponent<{
    session: Session
    lang: LocaleApp
}> = async ({ session, lang }) => {

    const [
        authSettings,
        dictionary,
        authErrors,
    ] = await Promise.all([
        getSettingsFromApi('auth'),
        getDictFromApi(lang, "change-password"),
        getDictFromApi(lang, "auth-validators-errors"),
    ])

    return (
        <CreateNewPasswordForm
            session={session}
            dictionary={dictionary}
            authErrors={authErrors}
            lang={lang}
            settings={authSettings}
        />
    )
}

export default NewPassword