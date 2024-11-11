import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import getSettingsFromApi from '@root/app/lib/settings/getSettingsFromApi';
import ClientFilesComponent from '@root/app/specific/components/ClientFiles/ClientFilesComponent';
import { type FunctionComponent } from 'react';

const ClientFiles: FunctionComponent<{
    lang: LocaleApp,
    pageName: string
}> = async ({ lang, pageName }) => {

    const [
        dictionary,
        mainSettings,
        clientFilesSettings,
    ] = await Promise.all([
        getDictFromApi(lang, ["shared", "dashboard", 'clients', "client-files"]),
        getSettingsFromApi('main'),
        getSettingsFromApi('client-files'),
    ])

    return (
        <div>
            <ClientFilesComponent
                lang={lang}
                pageName={pageName}
                dictionary={dictionary}
                settings={{ main: mainSettings, clientFiles: clientFilesSettings }}
            />
        </div>
    );
};

export default ClientFiles;