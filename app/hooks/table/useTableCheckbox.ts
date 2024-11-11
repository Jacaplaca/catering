import { useState } from 'react';

const useTableCheckbox = (idsOnPage: string[]) => {
    const [idsChecked, setIdsChecked] = useState<string[]>([]);

    const toggleCheck = (id: string) => {
        if (idsChecked.includes(id)) {
            setIdsChecked(idsChecked.filter((item) => item !== id));
        } else {
            setIdsChecked([...idsChecked, id]);
        }
    };

    const checkAllOnPage = () => {
        if (idsChecked.length === idsOnPage.length) {
            setIdsChecked([]);
        } else {
            setIdsChecked(idsOnPage);
        }
    };

    const uncheckAll = () => {
        setIdsChecked([]);
    };

    const isAllChecked = !!idsChecked.length && idsChecked.length === idsOnPage.length

    return {
        idsChecked,
        toggleCheck,
        checkAllOnPage,
        uncheckAll,
        isAllChecked
    };

};

export default useTableCheckbox;