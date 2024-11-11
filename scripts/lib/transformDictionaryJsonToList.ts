const transformDictionaryJsonToList = (jsonObj: Record<string, Record<string, string>>, lang: string) => {
    const result = Object.entries(jsonObj).reduce((acc, [group, items]) => {
        return acc.concat(Object.entries(items).map(([name, value]) => {
            return {
                group,
                name,
                lang,
                value
            }
        }))
    }, [] as { group: string, name: string, lang: string, value: string }[]);
    return result;
}

export default transformDictionaryJsonToList;
