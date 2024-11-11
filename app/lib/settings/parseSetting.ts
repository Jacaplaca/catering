import { type SettingType } from '@prisma/client';

const parseSetting = (
    { value, type }: { value: string, type: SettingType }
) => {
    switch (type) {
        case 'BOOLEAN':
            return value === 'true';
        case 'NUMBER':
            return parseInt(value);
        case "OBJECT":
            return JSON.parse(value) as Record<string, unknown> | null;
        case "STRING_ARRAY":
            return value.split(',').map(v => v.trim());
        case "NUMBER_ARRAY":
            return value.split(',').map(v => v.trim()).map((val) => parseInt(val));
        default:
            return value;
    }
};

export default parseSetting;