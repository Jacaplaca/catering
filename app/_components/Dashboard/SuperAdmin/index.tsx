'use client'
import SettingsFormRenderer from '@root/app/_components/Dashboard/Settings/FormRenderer';
import useEmailSettings from '@root/app/_components/Dashboard/SuperAdmin/useEmailSettings';
import MyButton from '@root/app/_components/ui/buttons/MyButton';

const SuperAdmin: React.FC<{ dictionary: Record<string, string>, children?: React.ReactNode }> = ({ dictionary, children }) => {

    const {
        form,
        onSubmit,
        hasFinishedSettings,
        Inputs,
        onTestEmail,
        isAppActive,
        onActivateApp,
        onDeactivateApp,
    } = useEmailSettings({ dictionary });

    return (
        <div>
            <SettingsFormRenderer
                dictionary={dictionary}
                onSubmit={onSubmit}
                form={form}
                hasFinishedSettings={hasFinishedSettings}
            >
                <div className="space-y-8 pb-6" > {Inputs}</div>
                <MyButton onClick={onTestEmail} id="test-email-button" ariaLabel="Test Email">Test Email</MyButton>
                {isAppActive
                    ? <MyButton onClick={onDeactivateApp} id="deactivate-app-button" ariaLabel="Deactivate App">Deactivate App</MyButton>
                    : <MyButton onClick={onActivateApp} id="activate-app-button" ariaLabel="Activate App">Activate App</MyButton>}

            </SettingsFormRenderer>
            {children}
        </div>
    )
}

export default SuperAdmin;