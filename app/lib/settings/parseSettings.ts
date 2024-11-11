import { type Setting, type SettingType } from '@prisma/client';
import parseSetting from '@root/app/lib/settings/parseSetting';
import { type SettingParsedType } from '@root/types';

const parseSettings = (settings: Setting[]) => {
    return settings.reduce((acc, setting) => {
        const { group, name, value, type } = setting as { group: string, name: string, value: string, type: SettingType }
        const key = `${group}:${name}`;
        acc[key] = parseSetting({ value, type });
        return acc;
    }, {} as SettingParsedType);
};

export default parseSettings;