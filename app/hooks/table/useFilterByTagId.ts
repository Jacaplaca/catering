import useParam from '@root/app/hooks/useParam';
import { useState } from 'react';

const useFilterByTagId = ({
    lang,
    pageName,
}: {
    lang: LocaleApp
    pageName: string
}) => {
    const setParam = useParam({ lang, pageName });
    const [tagId, setTagId] = useState<string>('');

    function updateTagId(id: string) {
        setTagId(id);
        setParam({ param: ['page', 1], slugs: [], withDomain: true });
    }

    return {
        tagId,
        updateTagId,
    }
}

export default useFilterByTagId;