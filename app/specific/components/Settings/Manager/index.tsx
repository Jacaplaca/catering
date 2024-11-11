'use client';

import { type FunctionComponent } from 'react';
import useManagerSettings from '@root/app/specific/components/Settings/Manager/useSettings';
import SettingsFormRenderer from '@root/app/_components/Dashboard/Settings/FormRenderer';

const ManagerSettings: FunctionComponent<{
    dictionary: Record<string, string>
}> = ({ dictionary }) => {

    const {
        form,
        onSubmit,
        hasFinishedSettings,
        Inputs,
    } = useManagerSettings({ dictionary });

    return (
        <SettingsFormRenderer
            dictionary={dictionary}
            onSubmit={onSubmit}
            form={form}
            hasFinishedSettings={hasFinishedSettings}
        >
            <div className="space-y-8 pb-6" > {Inputs}</div>
        </SettingsFormRenderer>
    );
};

export default ManagerSettings;
