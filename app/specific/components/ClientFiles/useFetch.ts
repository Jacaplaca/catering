import usePagination from '@root/app/hooks/usePagination';
import placeholderData from '@root/app/lib/table/placeholderData';
import { api } from '@root/app/trpc/react';
import { type TableColumnType } from '@root/types';
import { type ClientFilesSortName, type ClientFilesCustomTable } from '@root/types/specific';

function useFetchWeekFilesList({
    columns,
    searchValue,
    sortName,
    sortDirection,
    day
}: {
    columns: TableColumnType[],
    searchValue: string,
    sortName: ClientFilesSortName,
    sortDirection: 'asc' | 'desc',
    day: Date,
}) {
    const { data: totalCount = 0, refetch: countRefetch, isFetching: countIsFetching } = api.specific.clientFiles.count
        .useQuery({ day, searchValue }, {
            enabled: true,
        });

    const { page, limit } = usePagination(totalCount);

    const { data: fetchedRows = [], refetch: rowsRefetch, isFetching } = api.specific.clientFiles.getMany
        .useQuery({ page, limit, sortName, sortDirection, day, searchValue },
            {
                enabled: true,
                placeholderData: placeholderData<ClientFilesCustomTable>(limit, columns),
            },
        );

    return {
        data: {
            totalCount,
            fetchedRows,
            isFetching: countIsFetching || isFetching,
        },
        refetch: {
            countRefetch,
            rowsRefetch,
        },
        pagination: {
            page,
            limit,
        }
    }
}

export default useFetchWeekFilesList;
