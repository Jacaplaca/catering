import { type TableColumnType } from '@root/types'
import { type DieticianSortName } from '@root/types/specific'

const useDieticianColumns = ({
    sort
}: {
    sort: (by: DieticianSortName) => void
}) => {

    const columns: TableColumnType[] = [
        {
            key: "name",
            title: 'dieticians:name_column',
            sort: () => sort('name')
        },
    ]

    return columns
}

export default useDieticianColumns