import { type RoleType } from '@prisma/client';
import DashboardItemWrapper from '@root/app/_components/Dashboard/ItemWrapper';
import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import translate from '@root/app/lib/lang/translate';
import { auth } from '@root/app/server/auth';
import { type FunctionComponent } from 'react';
const SettingsWrapper: FunctionComponent<{
    lang: LocaleApp,
    pageName: string,
    clientId?: string,
    renderComponent: (props: { roleId?: RoleType, dictionary: Record<string, string>, clientId?: string }) => JSX.Element | null
}> = async ({ lang, renderComponent, clientId }) => {
    const dictionary = await getDictFromApi(lang, ["shared", "settings"]);
    const session = await auth();

    return (
        <DashboardItemWrapper
            title={translate(dictionary, 'settings:title')}
            className='max-w-screen-xl'
        >
            {renderComponent({ roleId: session?.user?.roleId, dictionary, clientId })}
        </DashboardItemWrapper>
    );
};

export default SettingsWrapper;
