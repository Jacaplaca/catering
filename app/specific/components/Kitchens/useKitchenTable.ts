import useTableSort from '@root/app/hooks/table/useTableSort';
import useSearch from '@root/app/hooks/useSearch';
import useKitchenColumns from '@root/app/specific/components/Kitchens/useColumns';
import useKitchenDataGrid from '@root/app/specific/components/Kitchens/useDataGrid';
import useFetchKitchens from '@root/app/specific/components/Kitchens/useFetch';
import useKitchenAction from '@root/app/specific/components/Kitchens/useRowAction';
import { type SettingParsedType } from '@root/types';
import { type KitchensSortName } from '@root/types/specific';
import { useEffect } from 'react';

const useKitchenTable = ({
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
    const { sort, sortDirection, sortName } = useTableSort<KitchensSortName>("name")
    const { searchValue, search } = useSearch({ lang, pageName });

    const columns = useKitchenColumns({ sort });

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
    } = useFetchKitchens({
        columns,
        searchValue,
        sortName,
        sortDirection,
    });

    const action = useKitchenAction({
        onSuccess: resetTable,
        rows: rows.map(el => el.id),
    });

    useEffect(() => {
        action.uncheckAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, searchValue]);


    const { skeleton, table } = useKitchenDataGrid({
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
export default useKitchenTable;