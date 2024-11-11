
function checkTranslations(translations: Record<string, Record<string, number>>): Record<string, string[]> {
    const languages = Object.keys(translations)

    if (typeof languages[0] === 'undefined') {
        return {};
    }

    if (translations[languages[0]] === undefined) {
        return {};
    }

    const groups = Object.keys(translations[languages[0]] ?? {});

    const missingTranslations: Record<string, string[]> = {};

    languages.forEach(language => {
        missingTranslations[language] = [];
    });

    groups.forEach(group => {

        if (typeof languages[0] === 'undefined') {
            return {};
        }

        if (translations[languages[0]] === undefined) {
            return {};
        }

        const referenceCount = translations[languages[0]]?.[group];

        languages.forEach(language => {
            if (typeof translations[language] === 'undefined') {
                return {};
            }
            if (translations[language]?.[group] !== referenceCount) {
                missingTranslations?.[language]?.push(group);
            }
        });
    });

    return missingTranslations;
}

export default checkTranslations;