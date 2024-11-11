import { type OrderStatus } from '@prisma/client';
import usePagination from '@root/app/hooks/usePagination';
import placeholderData from '@root/app/lib/table/placeholderData';
import { api } from '@root/app/trpc/react';
import { type TableColumnType } from '@root/types';
import { type OrdersCustomTable, type OrdersSortName } from '@root/types/specific';

function useFetchOrders({
    tagId,
    status,
    columns,
    showColumns,
    searchValue,
    sortName,
    sortDirection,
    clientId,
}: {
    columns: TableColumnType[],
    showColumns: string[],
    searchValue: string,
    sortName: OrdersSortName,
    sortDirection: 'asc' | 'desc',
    clientId?: string,
    status?: OrderStatus | null,
    tagId?: string,
}) {
    const { data: totalCount = 0, refetch: countRefetch, isFetching: countIsFetching }
        = api.specific.order.count.useQuery({ searchValue, showColumns, clientId, status, tagId }, {
            enabled: showColumns.length > 0,
        });

    const { page, limit } = usePagination(totalCount);

    const { data: fetchedRows = [], refetch: rowsRefetch, isFetching }
        = api.specific.order.table.useQuery({ page, limit, sortName, sortDirection, searchValue, showColumns, clientId, status, tagId },
            {
                enabled: showColumns.length > 0,
                placeholderData: placeholderData<OrdersCustomTable>(limit, columns),
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

export default useFetchOrders;
