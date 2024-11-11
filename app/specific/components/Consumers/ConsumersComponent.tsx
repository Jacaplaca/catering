'use client';
import ConsumersTable from '@root/app/specific/components/Consumers/ConsumersTable';
import { ConsumerTableContextProvider } from '@root/app/specific/components/Consumers/context';
import useConsumerTable from '@root/app/specific/components/Consumers/useConsumerTable';
import { type SettingParsedType } from '@root/types';
import { SessionProvider } from 'next-auth/react';
import { type FunctionComponent } from 'react';

const ConsumersComponent: FunctionComponent<{
    lang: LocaleApp
    pageName: string
    dictionary: Record<string, string>
    settings: { main: SettingParsedType }
}> = (props) => {

    return (
        <SessionProvider>
            <ConsumerTableContextProvider store={useConsumerTable({ ...props })} >
                <ConsumersTable />
            </ConsumerTableContextProvider>
        </SessionProvider >
    );
};

export default ConsumersComponent;