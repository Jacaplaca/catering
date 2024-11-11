import translatePageName from '@root/app/lib/url/translatePageName';
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
describe('translatePageName', () => {
    test('translates page name from source locale to target locale', () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const sourceLocale = 'en' as Locale; // Assuming 'en' is not a part of the mock
        const targetLocale = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        const sourcePageName = 'home';
        const result = translatePageName(sourceLocale, targetLocale, sourcePageName);
        expect(result).toBe('accueil');
    });

    test('returns original page name if translation is not found', () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const sourceLocale = 'en' as Locale; // Assuming 'en' is not a part of the mock
        const targetLocale = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        const sourcePageName = 'nonexistent';
        const result = translatePageName(sourceLocale, targetLocale, sourcePageName);
        expect(result).toBe('nonexistent');
    });

    test('handles translation when source and target locales are the same', () => {
        const sourceLocale = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        const targetLocale = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        const sourcePageName = 'a-propos';
        const result = translatePageName(sourceLocale, targetLocale, sourcePageName);
        expect(result).toBe('a-propos');
    });

    test('translates page name with different source and target locales', () => {
        const sourceLocale = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        const targetLocale = 'es' as Locale; // Assuming 'es' is not a part of the mock
        const sourcePageName = 'a-propos';
        const result = translatePageName(sourceLocale, targetLocale, sourcePageName);
        expect(result).toBe('acerca-de');
    });

    test('returns original page name if no counterpart is found in target locale', () => {
        const sourceLocale = 'es' as Locale; // Assuming 'es' is not a part of the mock
        const targetLocale = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        const sourcePageName = 'nono';
        const result = translatePageName(sourceLocale, targetLocale, sourcePageName);
        expect(result).toBe('nono');
    });
})