import { type ClientFileType } from '@prisma/client'
import { clientFileTypeDictionary } from '@root/app/assets/maps/catering'
import translate from '@root/app/lib/lang/translate'
import { type TableColumnType } from '@root/types'
import { type ClientFilesSortName } from '@root/types/specific'

const useClientFilesColumns = ({
    dictionary,
    sort,
    fileTypes,
    openGrouper
}: {
    dictionary: Record<string, string>
    sort: (by: ClientFilesSortName) => void
    fileTypes: ClientFileType[]
    openGrouper: (type: ClientFileType) => void
}) => {

    const columns: TableColumnType[] = [
        {
            key: "code",
            title: 'clients:info.code_column',
            sort: () => sort('code')
        },
        {
            key: "name",
            title: 'clients:info.name_column',
            sort: () => sort('name')
        },
        ...fileTypes.map(type => ({
            key: type,
            title: clientFileTypeDictionary[type].type,
            special: {
                action: () => openGrouper(type),
                icon: 'fa-solid fa-users',
                tooltip: translate(dictionary, clientFileTypeDictionary[type].tooltip)
            }
        }))
    ]

    return columns
}

export default useClientFilesColumns