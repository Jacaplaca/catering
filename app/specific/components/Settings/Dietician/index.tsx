'use client';

import { type FunctionComponent } from 'react';
import SettingsFormRenderer from '@root/app/_components/Dashboard/Settings/FormRenderer';
import useDieticianSettings from '@root/app/specific/components/Settings/Dietician/useSettings';

const DieticianSettings: FunctionComponent<{
    dictionary: Record<string, string>
}> = ({ dictionary }) => {

    const {
        form,
        onSubmit,
        hasFinishedSettings,
        Inputs,
    } = useDieticianSettings({ dictionary });

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

export default DieticianSettings;
