import usePagination from '@root/app/hooks/usePagination';
import placeholderData from '@root/app/lib/table/placeholderData';
import { api } from '@root/app/trpc/react';
import { type TableColumnType } from '@root/types';
import { type ConsumersSortName, type ConsumerCustomTable } from '@root/types/specific';

function useFetchConsumers({
    columns,
    showColumns,
    customerSearchValue,
    dietSearchValue,
    sortName,
    sortDirection,
    clientId,
    clientPlaceId
}: {
    columns: TableColumnType[],
    showColumns: string[],
    customerSearchValue: string,
    dietSearchValue: string,
    sortName: ConsumersSortName,
    sortDirection: 'asc' | 'desc',
    clientId?: string,
    clientPlaceId?: string
}) {
    const { data: totalCount = 0, refetch: countRefetch, isFetching: countIsFetching }
        = api.specific.consumer.count.useQuery({ customerSearchValue, dietSearchValue, showColumns, clientId, clientPlaceId }, {
            enabled: showColumns.length > 0,
        });

    const { page, limit } = usePagination(totalCount);

    const { data: fetchedRows = [], refetch: rowsRefetch, isFetching }
        = api.specific.consumer.getMany
            .useQuery({ page, limit, sortName, sortDirection, customerSearchValue, dietSearchValue, showColumns, clientId, clientPlaceId },
                {
                    enabled: showColumns.length > 0,
                    placeholderData: placeholderData<ConsumerCustomTable>(limit, columns),
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

export default useFetchConsumers;
