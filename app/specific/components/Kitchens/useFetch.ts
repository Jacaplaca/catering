import { type Kitchen } from '@prisma/client';
import usePagination from '@root/app/hooks/usePagination';
import placeholderData from '@root/app/lib/table/placeholderData';
import { api } from '@root/app/trpc/react';
import { type TableColumnType } from '@root/types';
import { type KitchensSortName } from '@root/types/specific';

function useFetchKitchens({
    columns,
    searchValue,
    sortName,
    sortDirection,
}: {
    columns: TableColumnType[],
    searchValue: string,
    sortName: KitchensSortName,
    sortDirection: 'asc' | 'desc',
}) {
    const { data: totalCount = 0, refetch: countRefetch, isFetching: countIsFetching } = api.specific.kitchen.count.useQuery({ searchValue }, {
        enabled: true,
    });

    const { page, limit } = usePagination(totalCount);

    const { data: fetchedRows = [], refetch: rowsRefetch, isFetching } = api.specific.kitchen.getMany
        .useQuery({ page, limit, sortName, sortDirection, searchValue },
            {
                enabled: true,
                placeholderData: placeholderData<Kitchen>(limit, columns),
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

export default useFetchKitchens;
