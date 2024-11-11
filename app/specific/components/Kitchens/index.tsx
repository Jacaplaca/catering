import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import getSettingsFromApi from '@root/app/lib/settings/getSettingsFromApi';
import KitchensComponent from '@root/app/specific/components/Kitchens/KitchensComponent';
import { type FunctionComponent } from 'react';

const Kitchens: FunctionComponent<{
    lang: LocaleApp,
    pageName: string
}> = async ({ lang, pageName }) => {

    const [
        dictionary,
        mainSettings,
    ] = await Promise.all([
        getDictFromApi(lang, ["shared", "role", "invite", "dashboard", "kitchens"]),
        getSettingsFromApi('main'),
    ])

    return (
        <div>
            <KitchensComponent
                lang={lang}
                pageName={pageName}
                dictionary={dictionary}
                settings={{ main: mainSettings }}
            />
        </div>
    );
};

export default Kitchens;