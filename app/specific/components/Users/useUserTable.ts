import useTableSort from '@root/app/hooks/table/useTableSort';
import usePagination from '@root/app/hooks/usePagination';
import useSearch from '@root/app/hooks/useSearch';
import useRoleFilter from '@root/app/specific/components/Users/filters/useRole';
import useUserColumns from '@root/app/specific/components/Users/useColumns';
import useUserDataGrid from '@root/app/specific/components/Users/useDataGrid';
import useUserAction from '@root/app/specific/components/Users/useRowAction';
import { api } from '@root/app/trpc/react';
import { type SettingParsedType } from '@root/types';
import { type UsersSortName } from '@root/types/specific';
import { useEffect } from 'react';

const useUserTable = ({
    lang,
    pageName,
    settings,
    dictionary,
}: {
    lang: LocaleApp,
    pageName: string,
    settings: { token: SettingParsedType, main: SettingParsedType },
    dictionary: Record<string, string>
}) => {
    const { sort, sortDirection, sortName } = useTableSort<UsersSortName>("name")
    const { searchValue, search } = useSearch({ lang, pageName });

    const { data: role, filter: roleFilter } = useRoleFilter({ lang, pageName, dictionary });

    const { data: totalCount = 0, refetch: countRefetch } = api.user.count.useQuery({ role, searchValue });

    const columns = useUserColumns({ dictionary, sort });

    const { page, limit } = usePagination(totalCount);

    const { data: rows = [], isFetching, refetch: rowsRefetch } = api.user.fetch.useQuery({ page, limit, sortName, sortDirection, role, searchValue });

    const action = useUserAction({
        onSuccess: resetTable,
        rows: rows.map(el => el.id),
        dictionary,
    });

    const { skeleton, table } = useUserDataGrid({
        rows,
        idsChecked: action.idsChecked,
        toggleCheck: action.toggleCheck,
        searchValue,
        limit,
        totalCount,
        dictionary
    })

    useEffect(() => {
        action.uncheckAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, role, searchValue]);

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
        filter: {
            roleFilter
        }
    }
};
export default useUserTable;