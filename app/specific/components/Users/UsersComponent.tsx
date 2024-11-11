'use client';
import UsersTable from '@root/app/specific/components/Users/UsersTable';
import { TableContextProvider } from '@root/app/specific/components/Users/context';
import useUserTable from '@root/app/specific/components/Users/useUserTable';
import { type SettingParsedType } from '@root/types';
import { type FunctionComponent } from 'react';

const UsersComponent: FunctionComponent<{
    lang: LocaleApp
    pageName: string
    dictionary: Record<string, string>
    settings: {
        token: SettingParsedType
        main: SettingParsedType
    }
}> = (props) => {

    return (
        <TableContextProvider
            store={useUserTable(props)}
        >
            <UsersTable />
        </TableContextProvider>
    );
};

export default UsersComponent;