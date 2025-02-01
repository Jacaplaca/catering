import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import getSettingsFromApi from '@root/app/lib/settings/getSettingsFromApi';
import ConsumersComponent from '@root/app/specific/components/Consumers/ConsumersComponent';
import { type FunctionComponent } from 'react';

const Consumers: FunctionComponent<{
    lang: LocaleApp,
    pageName: string,
    clientId?: string
}> = async ({ lang, pageName, clientId }) => {

    const [
        dictionary,
        mainSettings,
    ] = await Promise.all([
        getDictFromApi(lang, ["shared", "dashboard", "consumers"]),
        getSettingsFromApi('main'),
    ])

    return (
        <div>
            <ConsumersComponent
                lang={lang}
                pageName={pageName}
                dictionary={dictionary}
                clientId={clientId}
                settings={{
                    main: mainSettings,
                }}
            />
        </div>
    );
};

export default Consumers;