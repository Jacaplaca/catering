import { api } from "app/trpc/server";

const getDictFromApi = async (
    lang: LocaleApp,
    keys?: string[] | string,
): Promise<Record<string, string>> => {
    const query = { lang } as Record<string, string | string[]>;
    if (typeof keys === 'string') {
        query.key = keys;
    } else if (Array.isArray(keys)) {
        query.keys = keys;
    }
    const dictionary = await api.translation.getLangGroup(query) ?? {} as Record<string, string>;
    return dictionary;
};

export default getDictFromApi;