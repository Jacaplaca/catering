import { useState, useEffect, useMemo } from 'react';

function useRows<T extends { id: string }>(fetchedRows: T[]): [T[], React.Dispatch<React.SetStateAction<T[]>>, (row: T) => void] {
    const [rows, setRows] = useState<T[]>([]);

    const stableFetchedRows = useMemo(() => fetchedRows, [fetchedRows]);

    useEffect(() => {
        setRows(stableFetchedRows);
    }, [stableFetchedRows]);

    const updateRow = (row: T) => {
        const { id } = row;
        setRows((state) => {
            return state.map((r) => r.id === id ? row : r);
        });
    };

    return [rows, setRows, updateRow];
}

export default useRows;
