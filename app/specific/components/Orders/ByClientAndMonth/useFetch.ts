import { format } from 'date-fns';
import usePagination from '@root/app/hooks/usePagination';
import placeholderData from '@root/app/lib/table/placeholderData';
import { api } from '@root/app/trpc/react';
import { type TableColumnType } from '@root/types';
import { type OrderGroupedByClientAndMonthCustomTable, type OrdersGroupedByClientAndMonthSortName } from '@root/types/specific';

function useFetchByClientAndMonth({
    columns,
    sortDirection,
    sortName,
    deliveryMonth
}: {
    columns: TableColumnType[],
    sortDirection: 'asc' | 'desc',
    sortName: OrdersGroupedByClientAndMonthSortName,
    deliveryMonth?: Date | null
}) {
    const formattedDeliveryMonth = deliveryMonth ? format(deliveryMonth, 'yyyy-MM') : '';

    const { data: totalCount = 0, isFetching: countIsFetching }
        = api.specific.order.monthByClient.count.useQuery({ deliveryMonth: formattedDeliveryMonth }, {
            enabled: !!deliveryMonth,
        });

    const { page, limit } = usePagination(totalCount);

    const { data: fetchedRows = [], isFetching }
        = api.specific.order.monthByClient.table.useQuery({ page, limit, sortDirection, sortName, deliveryMonth: formattedDeliveryMonth },
            {
                enabled: !!deliveryMonth,
                placeholderData: placeholderData<OrderGroupedByClientAndMonthCustomTable>(limit, columns),
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

export default useFetchByClientAndMonth;
