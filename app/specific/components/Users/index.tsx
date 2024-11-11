import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import getSettingsFromApi from '@root/app/lib/settings/getSettingsFromApi';
import UsersComponent from '@root/app/specific/components/Users/UsersComponent';
import { type FunctionComponent } from 'react';

const Users: FunctionComponent<{
    lang: LocaleApp,
    pageName: string
}> = async ({ lang, pageName }) => {

    const [
        dictionary,
        tokenSettings,
        mainSettings,
    ] = await Promise.all([
        getDictFromApi(lang, ['users', "shared", "role", "invite", "dashboard"]),
        getSettingsFromApi('token'),
        getSettingsFromApi('main'),
    ])

    return (
        <div>
            <UsersComponent
                lang={lang}
                pageName={pageName}
                dictionary={dictionary}
                settings={{
                    token: tokenSettings,
                    main: mainSettings,
                }}
            />

        </div>
    );
};

export default Users;