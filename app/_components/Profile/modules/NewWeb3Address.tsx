import { type Session } from 'next-auth';
import { type FunctionComponent } from 'react'
import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import Web3AddressUpdate from '@root/app/_components/form/Web3AddressUpdate';
import getSettingsFromApi from '@root/app/lib/settings/getSettingsFromApi';

const NewWeb3Address: FunctionComponent<{
    session: Session
    lang: LocaleApp
}> = async ({ lang, session }) => {

    const [
        dictionaryChangeEmail,
        settings,
    ] = await Promise.all([
        getDictFromApi(lang, "web3"),
        getSettingsFromApi('web3'),
    ])

    return (
        <Web3AddressUpdate
            dictionary={dictionaryChangeEmail}
            lang={lang}
            session={session}
            settings={settings}
        />
    )
}

export default NewWeb3Address