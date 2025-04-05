import { type TableColumnType } from '@root/types'
import { type OrdersSortName } from '@root/types/specific'

const useOrderColumns = ({
    sort
}: {
    sort: (by: OrdersSortName) => void
}) => {

    const columns: TableColumnType[] = [
        {
            key: "deliveryDay",
            title: 'orders:delivery_day_column',
            sort: () => sort('deliveryDay'),
            align: 'center'
        },
        {
            key: "status",
            title: 'orders:status_column',
            sort: () => sort('status'),
            align: 'center'
        },
        {
            key: "client.name",
            title: 'orders:client_name_column',
            sort: () => sort('client.name'),
            align: 'center'
        },
        {
            key: "client.code",
            title: 'orders:client_code_column',
            sort: () => sort('client.code'),
            align: 'center'
        },
        {
            key: "breakfastStandard",
            title: 'orders:breakfastStandard_column',
            align: 'center'
        },
        {
            key: "lunchStandard",
            title: 'orders:lunchStandard_column',
            align: 'center'
        },
        {
            key: "dinnerStandard",
            title: 'orders:dinnerStandard_column',
            align: 'center'
        },
        {
            key: "breakfastDietCount",
            title: 'orders:breakfastDiet_column',
            align: 'center'
        },
        {
            key: "lunchDietCount",
            title: 'orders:lunchDiet_column',
            align: 'center'
        },
        {
            key: "dinnerDietCount",
            title: 'orders:dinnerDiet_column',
            align: 'center'
        },
        {
            key: "sentToCateringAt",
            title: 'orders:sentToCateringAt_column',
            align: 'center'
        },
    ]

    return columns
}

export default useOrderColumns