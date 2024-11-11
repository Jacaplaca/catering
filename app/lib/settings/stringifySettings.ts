import { type SettingType } from '@prisma/client';

const stringifySetting = (
    value: unknown,
    type: SettingType
): string => {
    if (typeof value === 'string') {
        return value;
    }
    switch (type) {
        case 'BOOLEAN':
            return (value as boolean).toString();
        case 'NUMBER':
            return (value as number).toString();
        case "OBJECT":
            return JSON.stringify(value);
        case "STRING_ARRAY":
            return Array.isArray(value) ? value.join(',') : '';
        case "NUMBER_ARRAY":
            return Array.isArray(value) ? (value as number[]).map(v => v.toString()).join(',') : '';
        default:
            return typeof value === 'string' ? value : '';
    }
};

export default stringifySetting;