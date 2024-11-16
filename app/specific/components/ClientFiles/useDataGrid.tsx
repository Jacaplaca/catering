import { type ClientFileType } from '@prisma/client';
import HighlightText from '@root/app/_components/Table/HighlightText';
import SkeletonCell from '@root/app/_components/Table/SkeletonCell';
import Checkbox from '@root/app/_components/ui/Inputs/Checkbox';
import UploadCell from '@root/app/specific/components/ClientFiles/UploadCell';
import { type ClientFilesCustomTable } from '@root/types/specific';

const useClientFilesDataGrid = ({
    rows,
    idsChecked,
    toggleCheck,
    searchValue,
    limit,
    totalCount,
    columns,
    fileTypes
}: {
    rows: ClientFilesCustomTable[]
    idsChecked: string[]
    toggleCheck: (id: string) => void
    searchValue: string,
    limit: number,
    totalCount: number,
    columns: { key: string }[],
    fileTypes: ClientFileType[]
}) => {

    const skeletonRowsCount = limit > totalCount ? totalCount : limit
    const skeleton = Array.from({ length: skeletonRowsCount }, (_, i) => {
        return {
            key: `skeleton-${i}`,
            rows: [
                {
                    component: <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        checked={false}
                        skeleton
                        onChange={() => { return void 0 }}
                    />,
                    className: "p-4 w-6"
                },
                ...columns.map(({ key }) => {
                    return {
                        component: <SkeletonCell />,
                        key
                    }
                })
            ]
        }
    })

    const table = rows.map((row, i) => {
        const { id, info } = row;
        return {
            key: id ?? `placeholderData-${i}`,
            rows: [
                {
                    component: <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        checked={idsChecked.includes(id)}
                        onChange={() => toggleCheck(id)}
                    />,
                    className: "p-4 w-6"
                },
                {
                    component: <HighlightText
                        text={info?.code ?? ""}
                        fragment={searchValue} />,
                    key: 'code'
                },
                {
                    component: <HighlightText
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                        text={info?.name ?? ""}
                        fragment={searchValue} />,
                    key: 'name'
                },
                ...fileTypes.map(type => ({
                    component: <UploadCell
                        files={row[type]}
                        clientId={id}
                        clientFileType={type} />,
                    key: type
                })),
            ]
        }
    });

    return { skeleton, table }

}

export default useClientFilesDataGrid;