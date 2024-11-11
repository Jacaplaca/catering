import replaceBraces from '@root/app/lib/lang/replaceBraces';

const translate = (dictionary: Record<string, string>, key: string | undefined | string[], replacements?: (string | number | undefined)[]): string => {
    if (!key) return '';
    if (Array.isArray(key) && key.length > 0) {
        const [translationKey, ...params] = key;
        if (!translationKey) return '';
        const translation = dictionary[translationKey] ?? translationKey;
        return replaceBraces(translation, params.map(x => x ? x.toString() : "")) ?? translation;
    } else if (typeof key === "string") {
        const translation = dictionary[key] ?? key;
        return replacements ? replaceBraces(translation, replacements.map(x => x ? x.toString() : "")) : translation;
    } else {
        return '';
    }
}

export default translate;

