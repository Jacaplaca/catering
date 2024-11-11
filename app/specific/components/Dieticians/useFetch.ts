import { type Dietician } from '@prisma/client';
import usePagination from '@root/app/hooks/usePagination';
import placeholderData from '@root/app/lib/table/placeholderData';
import { api } from '@root/app/trpc/react';
import { type TableColumnType } from '@root/types';
import { type DieticianSortName } from '@root/types/specific';

function useFetchDieticians({
    columns,
    searchValue,
    sortName,
    sortDirection,
}: {
    columns: TableColumnType[],
    searchValue: string,
    sortName: DieticianSortName,
    sortDirection: 'asc' | 'desc',
}) {
    const { data: totalCount = 0, refetch: countRefetch, isFetching: countIsFetching } = api.specific.dietician.count.useQuery({ searchValue }, {
        enabled: true,
    });

    const { page, limit } = usePagination(totalCount);

    const { data: fetchedRows = [], refetch: rowsRefetch, isFetching } = api.specific.dietician.getMany
        .useQuery({ page, limit, sortName, sortDirection, searchValue },
            {
                enabled: true,
                placeholderData: placeholderData<Dietician>(limit, columns),
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

export default useFetchDieticians;
