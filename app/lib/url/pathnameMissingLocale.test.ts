import pathnameMissingLocale from '@root/app/lib/url/pathnameMissingLocale';

jest.mock('@root/i18n-config', () => {
    const mockLocales = ['en', 'fr', 'es'];
    return {
        i18n: {
            locales: mockLocales
        },
        env: {
            NEXT_PUBLIC_DEFAULT_LOCALE: 'en'
        }
    };
});

describe('pathnameMissingLocale', () => {
    test('returns true when pathname does not start with any locale', () => {
        const pathname = '/about';
        expect(pathnameMissingLocale(pathname)).toBe(true);
    });

    test('returns false when pathname starts with a locale', () => {
        const pathname = '/en/about';
        expect(pathnameMissingLocale(pathname)).toBe(false);
    });

    test('returns false when pathname is exactly a locale', () => {
        const pathname = '/fr';
        expect(pathnameMissingLocale(pathname)).toBe(false);
    });

    test('returns true when pathname is root', () => {
        const pathname = '/';
        expect(pathnameMissingLocale(pathname)).toBe(true);
    });

    test('returns true when pathname is a locale with trailing slash', () => {
        const pathname = '/fr/';
        expect(pathnameMissingLocale(pathname)).toBe(false);
    });
});