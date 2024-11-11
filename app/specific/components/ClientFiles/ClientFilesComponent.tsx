'use client';
import ClientFilesTable from '@root/app/specific/components/ClientFiles/ClientFilesTable';
import { ClientFilesTableContextProvider } from '@root/app/specific/components/ClientFiles/context';
import useClientFilesTable from '@root/app/specific/components/ClientFiles/useClientFilesTable';
import { type SettingParsedType } from '@root/types';
import { type FunctionComponent } from 'react';

const ClientFilesComponent: FunctionComponent<{
    lang: LocaleApp
    pageName: string
    dictionary: Record<string, string>
    settings: { main: SettingParsedType, clientFiles: SettingParsedType }
}> = (props) => {

    return (
        <ClientFilesTableContextProvider store={useClientFilesTable(props)} >
            <ClientFilesTable />
        </ClientFilesTableContextProvider>
    );
};

export default ClientFilesComponent;