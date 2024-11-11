import useTableSort from '@root/app/hooks/table/useTableSort';
import useSearch from '@root/app/hooks/useSearch';
import useDieticianColumns from '@root/app/specific/components/Dieticians/useColumns';
import useDieticianDataGrid from '@root/app/specific/components/Dieticians/useDataGrid';
import useFetchDieticians from '@root/app/specific/components/Dieticians/useFetch';
import useDieticianAction from '@root/app/specific/components/Dieticians/useRowAction';
import { type SettingParsedType } from '@root/types';
import { type DieticianSortName } from '@root/types/specific';
import { useEffect } from 'react';

const useDieticianTable = ({
    lang,
    pageName,
    settings,
    dictionary,
}: {
    lang: LocaleApp,
    pageName: string,
    settings: { main: SettingParsedType },
    dictionary: Record<string, string>
}) => {
    const { sort, sortDirection, sortName } = useTableSort<DieticianSortName>("name")
    const { searchValue, search } = useSearch({ lang, pageName });

    const columns = useDieticianColumns({ sort });

    const {
        data: {
            totalCount,
            fetchedRows: rows,
            isFetching
        },
        refetch: {
            countRefetch,
            rowsRefetch,
        },
        pagination: {
            page,
            limit
        },
    } = useFetchDieticians({
        columns,
        searchValue,
        sortName,
        sortDirection,
    });


    const action = useDieticianAction({
        onSuccess: resetTable,
        rows: rows.map(el => el.id),
    });

    useEffect(() => {
        action.uncheckAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, searchValue]);


    const { skeleton, table } = useDieticianDataGrid({
        rows,
        idsChecked: action.idsChecked,
        toggleCheck: action.toggleCheck,
        searchValue,
        limit,
        totalCount,
        columns,
    })

    async function resetTable() {
        await countRefetch();
        await rowsRefetch();
        action.uncheckAll();
    }

    return {
        pageName,
        lang,
        dictionary,
        settings,
        data: { table, skeleton },
        columns: { columns },
        isFetching,
        totalCount,
        search,
        sort: { sortName, sortDirection },
        action,

    }
};
export default useDieticianTable;