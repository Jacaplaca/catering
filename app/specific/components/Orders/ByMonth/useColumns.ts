import { type TableColumnType } from '@root/types'
import { type OrdersGroupedByMonthSortName } from '@root/types/specific'

const useOrderGroupedByDayColumns = ({
    sort
}: {
    sort: (by: OrdersGroupedByMonthSortName) => void
}) => {

    const columns: TableColumnType[] = [
        {
            key: "id",
            title: 'orders:orders_by_month',
            sort: () => sort('id'),
            align: 'center'
        },
        {
            key: "breakfastStandard",
            title: 'orders:breakfast_column',
            sort: () => sort('breakfastStandard'),
            align: 'center'
        },
        {
            key: "lunchStandard",
            title: 'orders:lunch_column',
            sort: () => sort('lunchStandard'),
            align: 'center'
        },
        {
            key: "dinnerStandard",
            title: 'orders:dinner_column',
            sort: () => sort('dinnerStandard'),
            align: 'center'
        },
        {
            key: "breakfastDiet",
            title: 'orders:breakfastDiet_column',
            sort: () => sort('breakfastDiet'),
            align: 'center'
        },
        {
            key: "lunchDiet",
            title: 'orders:lunchDiet_column',
            sort: () => sort('lunchDiet'),
            align: 'center'
        },
        {
            key: "dinnerDiet",
            title: 'orders:dinnerDiet_column',
            sort: () => sort('dinnerDiet'),
            align: 'center'
        },
    ]

    return columns
}

export default useOrderGroupedByDayColumns