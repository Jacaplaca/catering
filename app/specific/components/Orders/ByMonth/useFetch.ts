import usePagination from '@root/app/hooks/usePagination';
import placeholderData from '@root/app/lib/table/placeholderData';
import { api } from '@root/app/trpc/react';
import { type TableColumnType } from '@root/types';
import { type OrderGroupedByMonthCustomTable, type OrdersGroupedByMonthSortName } from '@root/types/specific';

function useFetchOrdersByMonth({
    columns,
    sortDirection,
    sortName,
    clientId
}: {
    columns: TableColumnType[],
    sortDirection: 'asc' | 'desc',
    sortName: OrdersGroupedByMonthSortName,
    clientId?: string
}) {
    const { data: totalCount = 0, isFetching: countIsFetching }
        = api.specific.order.groupedByMonth.countForClient.useQuery({ clientId }, {
            enabled: !!clientId,
        });

    const { page, limit } = usePagination(totalCount);

    const { data: fetchedRows = [], isFetching }
        = api.specific.order.groupedByMonth.tableForClient.useQuery({ page, limit, sortDirection, sortName, clientId },
            {
                enabled: !!clientId,
                placeholderData: placeholderData<OrderGroupedByMonthCustomTable>(limit, columns),
            },
        );

    return {
        data: {
            totalCount,
            fetchedRows,
            isFetching: countIsFetching || isFetching,
        },
        pagination: {
            page,
            limit,
        }
    }
}

export default useFetchOrdersByMonth;
