import splitPathname from '@root/app/lib/url/splitPathname';

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

describe('splitPathname', () => {
    test('returns default locale, page and rest parts when locale is missing', () => {
        const pathname = '/about/team';
        const result = splitPathname(pathname);
        expect(result).toEqual({ langPath: 'en', page: 'about', rest: ['team'] });
    });

    test('returns given locale, page and rest parts when locale is present', () => {
        const pathname = '/fr/about/team';
        const result = splitPathname(pathname);
        expect(result).toEqual({ langPath: 'fr', page: 'about', rest: ['team'] });
    });

    test('handles root pathname', () => {
        const pathname = '/';
        const result = splitPathname(pathname);
        expect(result).toEqual({ langPath: 'en', page: "", rest: [] });
    });

    test('handles locale pathname with trailing slash', () => {
        const pathname = '/fr/';
        const result = splitPathname(pathname);
        expect(result).toEqual({ langPath: 'fr', page: "", rest: [] });
    });

    test('handles pathname with only locale', () => {
        const pathname = '/es';
        const result = splitPathname(pathname);
        expect(result).toEqual({ langPath: 'es', page: "", rest: [] });
    });

    test('returns default locale for pathname without locale', () => {
        const pathname = '/contact';
        const result = splitPathname(pathname);
        expect(result).toEqual({ langPath: 'en', page: 'contact', rest: [] });
    });
})