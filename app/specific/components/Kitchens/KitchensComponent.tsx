'use client';
import KitchenTable from '@root/app/specific/components/Kitchens/KitchenTable';
import { KitchensTableContextProvider } from '@root/app/specific/components/Kitchens/context';
import useKitchenTable from '@root/app/specific/components/Kitchens/useKitchenTable';
import { type SettingParsedType } from '@root/types';
import { type FunctionComponent } from 'react';

const KitchensComponent: FunctionComponent<{
    lang: LocaleApp
    pageName: string
    dictionary: Record<string, string>
    settings: { main: SettingParsedType }
}> = (props) => {

    return (
        <KitchensTableContextProvider store={useKitchenTable(props)} >
            <KitchenTable />
        </KitchensTableContextProvider>
    );
};

export default KitchensComponent;