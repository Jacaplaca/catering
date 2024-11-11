import { type RoleType } from '@prisma/client';
import HighlightText from '@root/app/_components/Table/HighlightText';
import SkeletonCell from '@root/app/_components/Table/SkeletonCell';
import Checkbox from '@root/app/_components/ui/Inputs/Checkbox';
import translate from '@root/app/lib/lang/translate';

const useUserDataGrid = ({
    rows,
    idsChecked,
    toggleCheck,
    searchValue,
    limit,
    totalCount,
    dictionary
}: {
    rows: { id: string, email: string, roleId: RoleType | null, name: string | null }[]
    idsChecked: string[]
    toggleCheck: (id: string) => void
    searchValue: string,
    limit: number,
    totalCount: number
    dictionary: Record<string, string>
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
                    className: "p-4"
                },
                {
                    component: <SkeletonCell className='dark:bg-neutral-400' />
                },
                {
                    component: <SkeletonCell />
                },
                {
                    component: <SkeletonCell />
                }
            ]
        }
    })

    const table = rows.map(({ id, email, roleId, name }) => {
        return {
            key: id,
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
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                        text={name ?? ""}
                        fragment={searchValue}
                    />
                },
                {
                    component: <HighlightText
                        text={email}
                        fragment={searchValue} />
                },
                {
                    component: <span>{translate(dictionary, `role:${roleId}`)}</span>
                },
            ]
        }
    });

    return { skeleton, table }

}

export default useUserDataGrid;