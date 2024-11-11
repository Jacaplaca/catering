import { type TableColumnType } from '@root/types'
import { type KitchensSortName } from '@root/types/specific'

const useKitchenColumns = ({
    sort
}: {
    sort: (by: KitchensSortName) => void
}) => {

    const columns: TableColumnType[] = [
        {
            key: "name",
            title: 'kitchens:name_column',
            sort: () => sort('name')
        },
    ]

    return columns
}

export default useKitchenColumns