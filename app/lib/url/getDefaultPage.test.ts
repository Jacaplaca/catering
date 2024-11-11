import getDefaultPage from '@root/app/lib/url/getDefaultPage';
import { type Locale } from '@root/i18n-config'

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

// const mockLocales: Languages[] = ['en', 'fr', 'es'];
describe('getDefaultPage', () => {
    test('returns the locale-specific page name if translation is found', () => {
        const locale = 'fr' as Locale; // Assuming 'fr' is part of the mock
        const pageName = 'accueil';
        const result = getDefaultPage(locale, pageName);
        expect(result).toBe('home');
    });

    test('returns the original page name if no translation is found', () => {

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const locale = 'en' as Locale; // Assuming 'en' is part of the mock
        const pageName = 'nonexistent';
        const result = getDefaultPage(locale, pageName);
        expect(result).toBe('nonexistent');
    });

    test('handles translation when the page name is already the locale-specific page name', () => {
        const locale = 'es' as Locale; // Assuming 'es' is part of the mock
        const pageName = 'inicio';
        const result = getDefaultPage(locale, pageName);
        expect(result).toBe('home');
    });

    test('handles cases where the locale is not present in the translations', () => {
        const locale = 'de' as Locale; // Assuming 'de' is not part of the mock
        const pageName = 'home';
        const result = getDefaultPage(locale, pageName);
        expect(result).toBe('');
    });

    test('returns the counterpart for a given page name', () => {
        const locale = 'es' as Locale; // Assuming 'es' is part of the mock
        const pageName = 'acerca-de';
        const result = getDefaultPage(locale, pageName);
        expect(result).toBe('about');
    });
})