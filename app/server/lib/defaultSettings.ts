import { type SettingAccessType, type SettingType } from "@prisma/client";
import stringifySetting from '@root/app/lib/settings/stringifySettings';
import * as fs from 'fs';
import { extname, join } from 'path';

type Setting = {
    access: SettingAccessType;
    group: string;
    name: string;
    type: SettingType;
    value: string;
}

export async function getDefaultSettings() {
    const folderPath = './app/assets/settings';
    const settings: Setting[] = [];

    try {
        const files = fs.readdirSync(folderPath, { withFileTypes: true });
        const tsFiles = files
            .filter(file => file.isFile() && extname(file.name) === '.ts')
            .sort((a, b) => {
                if (a.name === 'main.ts') return -1;
                if (b.name === 'specific.ts') return 1;
                return a.name.localeCompare(b.name);
            });

        let mergedSettings: Record<string, string> = {};

        for (const file of tsFiles) {
            const filePath = join(folderPath, file.name);
            const settingsModule = await import(filePath) as { default: Record<string, string> };
            if (settingsModule.default) {
                mergedSettings = { ...mergedSettings, ...settingsModule.default };
            }
        }

        for (const [key, value] of Object.entries(mergedSettings)) {
            const [access, group, name, type] = key.split(':') as [SettingAccessType, string, string, SettingType];
            settings.push({ access, group, name, type, value: stringifySetting(value, type) });
        }
    } catch (error) {
        console.error('Error processing files:', error);
    }

    return settings;
}

export async function getDefaultSetting(group: string, name: string) {
    const settings = await getDefaultSettings();
    return settings.find(setting => setting.group === group && setting.name === name);
}
