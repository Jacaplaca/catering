import { RoleType } from '@prisma/client';
import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import getSettingsFromApi from '@root/app/lib/settings/getSettingsFromApi';
import ClientOrdersComponent from '@root/app/specific/components/Orders/ClientOrdersComponent';
import OrdersComponent from '@root/app/specific/components/Orders/OrdersComponent';
import { type FunctionComponent } from 'react';
import { auth } from '@root/app/server/auth';

const Orders: FunctionComponent<{
    lang: LocaleApp,
    pageName: string,
    clientId?: string
}> = async ({ lang, pageName, clientId }) => {

    const [
        dictionary,
        mainSettings,
    ] = await Promise.all([
        getDictFromApi(lang, ["shared", "orders"]),
        getSettingsFromApi('main'),
    ])

    const session = await auth();
    const { user } = session ?? {};
    const showByDay = user?.roleId === RoleType.kitchen || user?.roleId === RoleType.manager || user?.roleId === RoleType.dietician;

    return (
        <div>
            {showByDay ? <OrdersComponent
                lang={lang}
                pageName={pageName}
                dictionary={dictionary}
                settings={{ main: mainSettings }}
                session={session}
                clientId={clientId}
            /> : <ClientOrdersComponent
                lang={lang}
                pageName={pageName}
                dictionary={dictionary}
                settings={{ main: mainSettings }}
                session={session}
                clientId={clientId}
            />}
        </div>
    );
};

export default Orders;