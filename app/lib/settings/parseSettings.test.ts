import parseSettings from '@root/app/lib/settings/parseSettings';
import parseSetting from '@root/app/lib/settings/parseSetting';
import { type Setting, type SettingType } from '@prisma/client';

// Mocking the parseSetting function
jest.mock('@root/app/lib/settings/parseSetting', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('parseSettings', () => {
    beforeEach(() => {
        // Reset the mock before each test
        (parseSetting as jest.Mock).mockReset();
    });

    it('should correctly parse settings and return an object', () => {
        const settings = [
            { group: 'group1', name: 'setting1', value: 'true', type: 'BOOLEAN' as SettingType },
            { group: 'group2', name: 'setting2', value: '123', type: 'NUMBER' as SettingType },
            { group: 'group3', name: 'setting3', value: 'some string', type: 'STRING' as SettingType }
        ] as Setting[];

        (parseSetting as jest.Mock)
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(123)
            .mockReturnValueOnce('some string');

        const expected = {
            'group1:setting1': true,
            'group2:setting2': 123,
            'group3:setting3': 'some string'
        };

        const result = parseSettings(settings);
        expect(result).toEqual(expected);

        // Ensure parseSetting was called correctly
        expect(parseSetting).toHaveBeenCalledWith({ value: 'true', type: 'BOOLEAN' });
        expect(parseSetting).toHaveBeenCalledWith({ value: '123', type: 'NUMBER' });
        expect(parseSetting).toHaveBeenCalledWith({ value: 'some string', type: 'STRING' });
    });

    it('should handle an empty array of settings', () => {
        const settings: Setting[] = [];
        const expected = {};

        const result = parseSettings(settings);
        expect(result).toEqual(expected);

        // Ensure parseSetting was not called
        expect(parseSetting).not.toHaveBeenCalled();
    });

    it('should handle settings with undefined values', () => {
        const settings = [
            { group: 'group1', name: 'setting1', value: 'true', type: 'BOOLEAN' as SettingType },
            { group: 'group2', name: 'setting2', value: undefined as unknown as string, type: 'NUMBER' as SettingType }
        ] as Setting[];

        (parseSetting as jest.Mock)
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(undefined);

        const expected = {
            'group1:setting1': true,
            'group2:setting2': undefined
        };

        const result = parseSettings(settings);
        expect(result).toEqual(expected);

        // Ensure parseSetting was called correctly
        expect(parseSetting).toHaveBeenCalledWith({ value: 'true', type: 'BOOLEAN' });
        expect(parseSetting).toHaveBeenCalledWith({ value: undefined, type: 'NUMBER' });
    });
});
