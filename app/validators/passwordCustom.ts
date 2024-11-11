import translate from '@root/app/lib/lang/translate';
import { type SettingValue } from '@root/types';

export const getRequirements = (settingsWithoutGroup: Record<string, SettingValue>,
    errorsDictionary: Record<string, string>,
    hideError: string[] = []) => {
    const requirements = {} as Record<string, string>

    Object.entries(settingsWithoutGroup).map(([nameSetting, requirement]) => {
        const error = errorsDictionary[`auth-validators-errors:${nameSetting}`];
        if (nameSetting && error) {
            if (requirement && error && !hideError.includes(nameSetting)) {
                requirements[nameSetting] = translate(errorsDictionary, `${error}`, [JSON.stringify(requirement)])
            }
        }
    })
    return requirements
}

export const validatePasswordCustomClient = (password: string,
    settingsWithoutGroup: Record<string, SettingValue>) => Object.keys(settingsWithoutGroup)
        .reduce((acc, settingName) => {
            if (settingName === "password-min-length"
                && typeof settingsWithoutGroup["password-min-length"] === "number") {
                if (password.length < settingsWithoutGroup["password-min-length"]) {
                    acc.push(settingName)
                }
            }
            if (settingName === "password-max-length"
                && typeof settingsWithoutGroup["password-max-length"] === "number") {
                if (password.length >= settingsWithoutGroup["password-max-length"]) {
                    acc.push(settingName)
                }
            }
            if (settingName === "password-require-number"
                && settingsWithoutGroup["password-require-number"]) {
                const regex = /[0-9]/g;
                if (!regex.test(password)) {
                    acc.push(settingName)
                }
            }
            if (settingName === "password-require-special"
                && settingsWithoutGroup["password-require-special"]) {
                const regex = /[!@#$%^&*(),.?":{}|<>]/g;
                if (!regex.test(password)) {
                    acc.push(settingName)
                }
            }
            if (settingName === "password-require-uppercase"
                && settingsWithoutGroup["password-require-uppercase"]) {
                const regex = /[A-Z]/g;
                if (!regex.test(password)) {
                    acc.push(settingName)
                }
            }
            if (settingName === "password-require-lowercase"
                && settingsWithoutGroup["password-require-lowercase"]) {
                const regex = /[a-z]/g;
                if (!regex.test(password)) {
                    acc.push(settingName)
                }
            }
            return acc;
        }, [] as string[])

