import { type SettingAccessType, type SettingType } from "@prisma/client";
import stringifySetting from '@root/app/lib/settings/stringifySettings';

type Setting = {
    access: SettingAccessType;
    group: string;
    name: string;
    type: SettingType;
    value: string;
}

export async function getDefaultSettings() {
    const mainSettings = await import('@root/app/assets/settings/main');
    const specificSettings = await import('@root/app/assets/settings/specific');

    const allSettingsModules = [
        mainSettings.default,
        specificSettings.default,
    ];

    const settings: Setting[] = [];
    let mergedSettings: Record<string, unknown> = {};

    for (const settingsModule of allSettingsModules) {
        mergedSettings = { ...mergedSettings, ...settingsModule };
    }

    for (const [key, value] of Object.entries(mergedSettings)) {
        const [access, group, name, type] = key.split(':') as [SettingAccessType, string, string, SettingType];
        settings.push({ access, group, name, type, value: stringifySetting(value, type) });
    }

    return settings;
}

export async function getDefaultSetting(group: string, name: string) {
    const settings = await getDefaultSettings();
    return settings.find(setting => setting.group === group && setting.name === name);
}
