import { useState, type FunctionComponent, useEffect } from 'react';
import { getRequirements, validatePasswordCustomClient } from '@root/app/validators/passwordCustom';
import { type SettingParsedType } from '@root/types';

const Requirement: FunctionComponent<{ label: string, isMeet?: boolean }> = ({ label, isMeet }) => (
    <div className='flex flex-row gap-3'>
        <i className={`fas ${isMeet
            ? 'fa-check'
            : 'fa-times'
            } text-base ${isMeet
                ? 'text-success dark:text-darkmode-success'
                : 'text-error dark:text-darkmode-error'} w-3`}></i>
        <p
            className={`text-text dark:text-darkmode-text text-xs`}
        >{label}</p>
    </div>
)

const PasswordRequirements: FunctionComponent<{
    settings: SettingParsedType;
    dictionary: Record<string, string>;
    password?: string;
}> = ({
    settings,
    dictionary,
    password = ''
}) => {
        const [reqNotMeet, setReqNotMeet] = useState<string[]>(Object.keys(settings));
        const requirements = getRequirements(settings, dictionary)

        useEffect(() => {
            const reqNotMeet = validatePasswordCustomClient(password, settings)
            setReqNotMeet(reqNotMeet)
        }, [password, settings])

        return (
            <div>
                <div className='flex flex-col gap-1 border-[1px] border-border dark:border-darkmode-border rounded-lg p-3 mb-6'>
                    {Object.entries(requirements).map(([reqName, requirementOrError], i) => (
                        <Requirement
                            key={i}
                            label={requirementOrError}
                            isMeet={!reqNotMeet.includes(reqName)}
                        />
                    ))}
                </div>

            </div>
        )

    };

export default PasswordRequirements;