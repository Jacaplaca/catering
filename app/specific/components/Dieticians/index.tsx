import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import getSettingsFromApi from '@root/app/lib/settings/getSettingsFromApi';
import DieticiansComponent from '@root/app/specific/components/Dieticians/DieticiansComponent';
import { type FunctionComponent } from 'react';

const Dieticians: FunctionComponent<{
    lang: LocaleApp,
    pageName: string
}> = async ({ lang, pageName }) => {

    const [
        dictionary,
        mainSettings,
    ] = await Promise.all([
        getDictFromApi(lang, ["shared", "role", "invite", "dashboard", "dieticians"]),
        getSettingsFromApi('main'),
    ])

    return (
        <div>
            <DieticiansComponent
                lang={lang}
                pageName={pageName}
                dictionary={dictionary}
                settings={{ main: mainSettings }}
            />
        </div>
    );
};

export default Dieticians;