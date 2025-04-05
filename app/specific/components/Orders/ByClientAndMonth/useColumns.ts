import { type TableColumnType } from '@root/types'
import { type OrdersGroupedByClientAndMonthSortName } from '@root/types/specific'

const useByClientAndMonthColumns = ({
    sort
}: {
    sort: (by: OrdersGroupedByClientAndMonthSortName) => void
}) => {

    const columns: TableColumnType[] = [
        {
            key: "client.info.name",
            title: 'orders:client_name_column',
            sort: () => sort('client.info.name'),
            align: 'left'
        },
        {
            key: "client.info.code",
            title: 'orders:client_code_column',
            sort: () => sort('client.info.code'),
            align: 'left'
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
            key: "breakfastDietCount",
            title: 'orders:breakfastDiet_column',
            sort: () => sort('breakfastDietCount'),
            align: 'center'
        },
        {
            key: "lunchDietCount",
            title: 'orders:lunchDiet_column',
            sort: () => sort('lunchDietCount'),
            align: 'center'
        },
        {
            key: "dinnerDietCount",
            title: 'orders:dinnerDiet_column',
            sort: () => sort('dinnerDietCount'),
            align: 'center'
        },
    ]

    return columns
}

export default useByClientAndMonthColumns