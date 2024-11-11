import { type TableColumnType } from '@root/types'
import { type UsersSortName, } from '@root/types/specific'

const useUserColumns = ({
    sort
}: {
    dictionary: Record<string, string>,
    sort: (by: UsersSortName) => void

}) => {

    const columns: TableColumnType[] = [
        {
            key: "name",
            title: "Name",
            sort: () => sort('name')
        },
        {
            key: "email",
            title: "Email",
            sort: () => sort('email')
        },
        {
            key: "role",
            title: "Role",
        }
    ]

    return columns
}

export default useUserColumns