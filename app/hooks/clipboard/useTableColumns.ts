import { type ClipboardKey } from '@prisma/client';
import { api } from '@root/app/trpc/react';
import { type TableColumnType } from '@root/types';
import { useEffect, useState } from 'react';

const useTableColumns = ({ key, allColumns }: { key: ClipboardKey, allColumns: TableColumnType[] }) => {

    const { data, isSuccess } = api.clipboard.getClipboard
        .useQuery({ key }) as { data: { value: string[] | null }, refetch: () => void, isSuccess: boolean, isError: boolean };

    const { value: userColumns } = data ?? {};

    const { data: roleColumns, isSuccess: roleColumnsSuccess } = api.settings.getTableColumns
        .useQuery({ key }, {
            enabled: !userColumns,
        }) as { data: string[] | null, refetch: () => void, isSuccess: boolean, isError: boolean };

    const [
        showColumns,
        setShowColumns
    ] = useState<string[]>(userColumns ?? []);

    useEffect(() => {
        if (userColumns) {
            setShowColumns(userColumns);
        } else if (roleColumnsSuccess && roleColumns && !userColumns) {
            setShowColumns(roleColumns);
        } else if (!userColumns && !roleColumns) {
            setShowColumns(allColumns.map(column => column.key));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userColumns, isSuccess, roleColumnsSuccess, roleColumns]);

    const updateClipboard = api.settings.updateTableColumns.useMutation({
        onSuccess: () => {
            console.log('Clipboard updated');
        },
        onError: (error) => {
            console.log(error.data, error.message, error.shape);
        },
    });

    const updateColumnsList = (columns: string[]) => {
        setShowColumns(columns);
        if (columns.length !== userColumns?.length) {
            updateClipboard.mutate({ columns, key });
        };
    };

    const toggleColumn = (columns: { key: string }[], key: string) => {
        if (!showColumns) {
            const newSet = columns.filter(column => column.key !== key).map(column => column.key);
            updateColumnsList(newSet);
        } else {
            if (showColumns.includes(key)) {
                let newSet = showColumns.filter(column => column !== key);
                newSet = newSet.length ? newSet : columns.map(column => column.key);
                updateColumnsList(newSet);
            } else {
                const newSet = showColumns ? [...showColumns, key] : [key];
                updateColumnsList(newSet);
            }
        }
    };

    const columns = roleColumns
        ? allColumns.filter(column => roleColumns.includes(column.key))
        : allColumns;

    return {
        showColumns,
        toggleColumn,
        columns,
    };
};

export default useTableColumns;