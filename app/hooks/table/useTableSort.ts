import { useState } from 'react';

type SortDirection = 'asc' | 'desc';

const useTableSort = <T extends string>(defaultSortName: T, defaultSortDirection: SortDirection = 'asc') => {
    const [sortName, setSortName] = useState<T>(defaultSortName);
    const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);

    function sort(name: T) {
        if (sortName === name) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortName(name);
            setSortDirection('asc');
        }
    }

    return {
        sortName,
        sortDirection,
        sort
    }
}

export default useTableSort;
