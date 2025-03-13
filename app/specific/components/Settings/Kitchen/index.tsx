'use client';

import { type FunctionComponent } from 'react';
import SettingsFormRenderer from '@root/app/_components/Dashboard/Settings/FormRenderer';
import useKitchenSettings from '@root/app/specific/components/Settings/Kitchen/useSettings';

const KitchenSettings: FunctionComponent<{
    dictionary: Record<string, string>
}> = ({ dictionary }) => {

    const {
        form,
        onSubmit,
        hasFinishedSettings,
        Inputs,
    } = useKitchenSettings({ dictionary });

    return (
        <SettingsFormRenderer
            dictionary={dictionary}
            onSubmit={onSubmit}
            form={form}
            hasFinishedSettings={hasFinishedSettings}
        >
            <div className="space-y-8 pb-6" > {Inputs} </div>
        </SettingsFormRenderer>
    );
};

export default KitchenSettings;
