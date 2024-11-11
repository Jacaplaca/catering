
// pathTranslating.test.ts

import makeHref from '@root/app/lib/url/makeHref';
import { type Locale } from '@root/i18n-config'

jest.mock('@root/app/lib/url/getBaseUrl', () => jest.fn(() => 'https://example.com'));

jest.mock('@root/i18n-config', () => {
    const mockLocales = ['en', 'fr', 'es'];
    return {
        i18n: {
            locales: mockLocales,
            appStructureLocale: 'en'
        },
        env: {
            NEXT_PUBLIC_DEFAULT_LOCALE: 'en'
        }
    };
});
// const mockLocales: Languages[] = ['en', 'fr', 'es'];

jest.mock('@root/app/assets/pageNameTranslation', () => ({
    en: {
        home: 'home',
        about: 'about',
        contact: 'contact'
    },
    fr: {
        accueil: 'home',
        "a-propos": 'about',
        contact: 'contact'
    },
    es: {
        inicio: 'home',
        "acerca-de": 'about',
        contacto: 'contact'
    }
}));

describe('makeHref', () => {

    jest.mock('@root/app/lib/url/translatePageName', () => jest.fn((srcLang: 'en', lang: 'en' | 'fr' | 'es', page: string): string => {
        const translations: Record<string, Record<string, string>> = {
            en: { home: 'home', about: 'about', contact: 'contact' },
            fr: { home: 'accueil', about: 'a-propos', contact: 'contact' },
            es: { home: 'inicio', about: 'acerca-de', contact: 'contacto' }
        };
        return translations?.[lang]?.[page] ?? page;
    })
    );

    test('generates href with default language and no page or slugs', () => {
        const result = makeHref({});
        expect(result).toBe('');
    });

    test('generates href with specified language and no page or slugs', () => {
        const lang = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        const result = makeHref({ lang });
        expect(result).toBe('/fr');
    });

    test('generates href with page and no slugs', () => {
        const result = makeHref({ lang: 'en', page: 'home' });
        expect(result).toBe('/home');
    });

    test('generates href with page and slugs', () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const lang = 'en' as Locale; // Assuming 'en' is not a part of the mock
        const result = makeHref({ lang, page: 'home', slugs: ['products', 'item1'] });
        expect(result).toBe('/home/products/item1');
    });

    test('generates href with domain when withDomain is true', () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const lang = 'en' as Locale; // Assuming 'en' is not a part of the mock
        const result = makeHref({ lang, page: 'home' }, true);
        expect(result).toBe('https://example.com/home');
    });

    test('generates href with different language and page', () => {
        const lang = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        const result = makeHref({ lang, page: 'about' });
        expect(result).toBe('/fr/a-propos');
    });

    test('generates href with different language, page, and slugs', () => {
        const lang = 'es' as Locale; // Assuming 'es' is not a part of the mock
        const result = makeHref({ lang, page: 'contact', slugs: ['support'] });
        expect(result).toBe('/es/contacto/support');
    });

    test('generates href with default language and no slugs', () => {
        const result = makeHref({ page: 'about' });
        expect(result).toBe('/about');
    });

    test('generates href with slugs only and no page', () => {
        const result = makeHref({ slugs: ['blog', 'post1'] });
        expect(result).toBe('');
    });

    test('generates href with specified language, page, and withDomain', () => {
        const lang = 'es' as Locale; // Assuming 'es' is not a part of the mock
        const result = makeHref({ lang, page: 'home' }, true);
        expect(result).toBe('https://example.com/es/inicio');
    });
});