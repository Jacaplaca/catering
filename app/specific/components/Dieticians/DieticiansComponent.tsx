'use client';
import DieticiansTable from '@root/app/specific/components/Dieticians/DieticiansTable';
import { DieticianTableContextProvider } from '@root/app/specific/components/Dieticians/context';
import useDieticianTable from '@root/app/specific/components/Dieticians/useDieticianTable';
import { type SettingParsedType } from '@root/types';
import { type FunctionComponent } from 'react';

const DieticiansComponent: FunctionComponent<{
    lang: LocaleApp
    pageName: string
    dictionary: Record<string, string>
    settings: { main: SettingParsedType }
}> = (props) => {

    return (
        <DieticianTableContextProvider store={useDieticianTable(props)} >
            <DieticiansTable />
        </DieticianTableContextProvider>
    );
};

export default DieticiansComponent;