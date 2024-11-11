import useParam from '@root/app/hooks/useParam';
import { useState } from 'react';

const useFilterConsumers = ({
    lang,
    pageName,
}: {
    lang: LocaleApp
    pageName: string
}) => {
    const setParam = useParam({ lang, pageName });
    const [clientForFilter, setClientForFilter] = useState<{ id: string, name: string, code: string } | null>(null);

    function chooseClient(id: string | null, allItems: { id: string, name: string, code: string }[]) {
        const client = allItems.find(item => item.id === id)
        setClientForFilter(client ?? null)
        setParam({ param: ['page', 1], slugs: [], withDomain: true });
    }

    return {
        clients: {
            chooseClient,
            clientForFilter,
        }
    };
}

export default useFilterConsumers;