import useParam from '@root/app/hooks/useParam';
import { useState } from 'react';

const useSearch = ({
    lang,
    pageName,
}: {
    lang: LocaleApp
    pageName: string
}) => {
    const setParam = useParam({ lang, pageName });

    const [searchValue, setSearchValue] = useState<string>('');

    const search = (value: string) => {
        setSearchValue(value);
        setParam({ param: ['page', 1], slugs: [], withDomain: true });
    }

    return { searchValue, search };
};

export default useSearch;