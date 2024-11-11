
// pathTranslating.test.ts
import translatePath from '@root/app/lib/url/translatePath';
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
describe('translatePath', () => {
    test('translates path from source locale to target locale with slugs', () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const sourceLocale = 'en' as Locale; // Assuming 'en' is not a part of the mock
        const targetLocale = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        const sourcePath = '/home/aaaen';
        const slugs = { fr: 'aaafr' };
        const result = translatePath({ sourceLocale, targetLocale, sourcePath, slugs });
        expect(result).toBe('/fr/accueil/aaafr');
    });

    test('returns root path for default locale', () => {
        const sourceLocale = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const targetLocale = 'en' as Locale; // Assuming 'en' is not a part of the mock
        const sourcePath = '/accueil';
        const result = translatePath({ sourceLocale, targetLocale, sourcePath });
        expect(result).toBe('/home');
    });

    test('handles missing page translation', () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const sourceLocale = 'en' as Locale; // Assuming 'en' is not a part of the mock
        const targetLocale = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        const sourcePath = '/nonexistent';
        const result = translatePath({ sourceLocale, targetLocale, sourcePath });
        expect(result).toBe('/fr/nonexistent');
    });

    test('translates path with forceLang and sourcePath as root', () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const sourceLocale = 'en' as Locale; // Assuming 'en' is not a part of the mock
        const targetLocale = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        const sourcePath = '/';
        const result = translatePath({ sourceLocale, targetLocale, sourcePath, forceLang: true });
        expect(result).toBe('/fr');
    });

    test('translates path without slugs', () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const sourceLocale = 'en' as Locale; // Assuming 'en' is not a part of the mock
        const targetLocale = 'es' as Locale; // Assuming 'es' is not a part of the mock
        const sourcePath = '/home';
        const result = translatePath({ sourceLocale, targetLocale, sourcePath });
        expect(result).toBe('/es/inicio');
    });

    test('handles path with only locale', () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const sourceLocale = 'en' as Locale; // Assuming 'en' is not a part of the mock
        const targetLocale = 'es' as Locale; // Assuming 'es' is not a part of the mock
        const sourcePath = '/en';
        const result = translatePath({ sourceLocale, targetLocale, sourcePath });
        expect(result).toBe('/es');
    });

    test('translates path with multiple slugs', () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const sourceLocale = 'en' as Locale; // Assuming 'en' is not a part of the mock
        const targetLocale = 'fr' as Locale; // Assuming 'fr' is not a part of the mock
        const sourcePath = '/home/products';
        const slugs = { fr: 'produits' };
        const result = translatePath({ sourceLocale, targetLocale, sourcePath, slugs });
        expect(result).toBe('/fr/accueil/produits');
    });
});
