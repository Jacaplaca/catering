import { type SettingType } from '@prisma/client';
import parseSetting from '@root/app/lib/settings/parseSetting';

describe('parseSetting', () => {
    it('should parse BOOLEAN type correctly', () => {
        const input = { value: 'true', type: 'BOOLEAN' as SettingType };
        const expected = true;
        expect(parseSetting(input)).toBe(expected);

        const inputFalse = { value: 'false', type: 'BOOLEAN' as SettingType };
        const expectedFalse = false;
        expect(parseSetting(inputFalse)).toBe(expectedFalse);
    });

    it('should parse NUMBER type correctly', () => {
        const input = { value: '123', type: 'NUMBER' as SettingType };
        const expected = 123;
        expect(parseSetting(input)).toBe(expected);
    });

    it('should return the value for unrecognized types', () => {
        const input = { value: 'some string', type: 'STRING' as SettingType };
        const expected = 'some string';
        expect(parseSetting(input)).toBe(expected);
    });

    it('should handle invalid BOOLEAN values correctly', () => {
        const input = { value: 'not a boolean', type: 'BOOLEAN' as SettingType };
        const expected = false;
        expect(parseSetting(input)).toBe(expected);
    });

    it('should handle invalid NUMBER values correctly', () => {
        const input = { value: 'not a number', type: 'NUMBER' as SettingType };
        expect(parseSetting(input)).toBeNaN();
    });

    it('should return the original value if type is not provided', () => {
        const input = { value: 'no type', type: undefined as unknown as SettingType };
        const expected = 'no type';
        expect(parseSetting(input)).toBe(expected);
    });
});
