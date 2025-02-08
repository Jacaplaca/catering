'use client';
import { type SettingParsedType } from '@root/types';
import { type FunctionComponent } from 'react';
import OrdersTable from '@root/app/specific/components/Orders/ByOrder/OrdersTable';
import { SessionProvider } from 'next-auth/react';
import { type Session } from 'next-auth';
import { OrderTableContextProvider } from '@root/app/specific/components/Orders/ByOrder/context';
import useOrderTable from '@root/app/specific/components/Orders/ByOrder/useOrderTable';
// import { OrderByDayTableContextProvider } from '@root/app/specific/components/Orders/ByDay/context';
// import Tabs from '@root/app/_components/ui/Tabs';
// import { Tabs as FlowbiteTabs } from 'flowbite-react';
// import translate from '@root/app/lib/lang/translate';
// import useOrderByDayTable from '@root/app/specific/components/Orders/ByDay/useOrderTable';
// import OrdersByDayTable from '@root/app/specific/components/Orders/ByDay/OrdersTable';

const ClientOrdersComponent: FunctionComponent<{
    lang: LocaleApp
    pageName: string
    dictionary: Record<string, string>
    settings: { main: SettingParsedType }
    session: Session | null
    clientId?: string
}> = (props) => {


    return (
        <SessionProvider session={props.session}>
            <OrderTableContextProvider store={useOrderTable(props)} >
                <OrdersTable />
            </OrderTableContextProvider>
            {/* <Tabs aria-label="Tabs with underline" variant="default" title={translate(props.dictionary, 'orders:title')}>
                <FlowbiteTabs.Item active title={translate(props.dictionary, 'orders:orders_by_day')}>
                    <OrderTableContextProvider store={useOrderTable(props)} >
                        <OrdersTable />
                    </OrderTableContextProvider>
                </FlowbiteTabs.Item>
                <FlowbiteTabs.Item title={translate(props.dictionary, 'orders:orders_by_month')}>
                    <OrderByDayTableContextProvider store={useOrderByDayTable(props)} >
                        <OrdersByDayTable />
                    </OrderByDayTableContextProvider>
                </FlowbiteTabs.Item>
            </Tabs> */}
        </SessionProvider>
    );
};

export default ClientOrdersComponent;