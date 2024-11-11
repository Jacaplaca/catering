import { type Session } from 'next-auth';
import { type FunctionComponent } from 'react'
import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import ChangeEmailForm from '@root/app/_components/form/ChangEmail';

const NewEmail: FunctionComponent<{
    session: Session
    lang: LocaleApp
}> = async ({ session, lang }) => {

    const dictionary = await getDictFromApi(lang, ["change-email", "auth-validators-errors"])


    return (
        <ChangeEmailForm
            session={session}
            dictionary={dictionary}
            lang={lang}
        />
    )
}

export default NewEmail