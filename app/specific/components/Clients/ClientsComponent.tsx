'use client';
import ClientsTable from '@root/app/specific/components/Clients/ClientsTable';
import { TableContextProvider } from '@root/app/specific/components/Clients/context';
import useClientTable from '@root/app/specific/components/Clients/useClientTable';
import { type SettingParsedType } from '@root/types';
import { type FunctionComponent } from 'react';

const ClientsComponent: FunctionComponent<{
    lang: LocaleApp
    pageName: string
    dictionary: Record<string, string>
    settings: { main: SettingParsedType }
}> = (props) => {

    return (
        <TableContextProvider store={useClientTable(props)} >
            <ClientsTable />
        </TableContextProvider>
    );
};

export default ClientsComponent;