import useRows from '@root/app/hooks/table/useRows';
import useTableSort from '@root/app/hooks/table/useTableSort';
import useMessage from '@root/app/hooks/useMessage';
import useSearch from '@root/app/hooks/useSearch';
import useLabelsPdf from '@root/app/specific/components/Orders/ByDay/DayMealsCell/useLabelsPdf';
import useMealPdf from '@root/app/specific/components/Orders/ByDay/DayMealsCell/useMealPdf';
import useDay from '@root/app/specific/components/Orders/ByDay/ExpandedRow/useDay';
import useOrderGroupedByDayColumns from '@root/app/specific/components/Orders/ByDay/useColumns';
import useOrderGroupedByDayDataGrid from '@root/app/specific/components/Orders/ByDay/useDataGrid';
import useFetchOrdersByDay from '@root/app/specific/components/Orders/ByDay/useFetch';
import useOrderAction from '@root/app/specific/components/Orders/ByOrder/useRowAction';
import { type SettingParsedType } from '@root/types';
import { type OrderGroupedByDayCustomTable, type OrdersSortName } from '@root/types/specific';
import { type Session } from 'next-auth';
import { useEffect } from 'react';

const useOrderByDayTable = ({
    session,
    lang,
    pageName,
    settings,
    dictionary,
}: {
    session: Session | null,
    lang: LocaleApp,
    pageName: string,
    settings: { main: SettingParsedType },
    dictionary: Record<string, string>,
}) => {
    const { messageObj, resetMessage, updateMessage } = useMessage(dictionary);
    const { sort, sortDirection, sortName } = useTableSort<OrdersSortName>("deliveryDay", 'desc')
    const { searchValue, search } = useSearch({ lang, pageName });
    const mealPdf = useMealPdf(lang, updateMessage);
    const labelsPdf = useLabelsPdf(lang, updateMessage);

    const columns = useOrderGroupedByDayColumns({ sort });

    const {
        data: {
            totalCount,
            fetchedRows,
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
    } = useFetchOrdersByDay({
        columns,
        sortDirection,
    });

    const [rows] = useRows<OrderGroupedByDayCustomTable>(fetchedRows);

    const row = useDay();

    const action = useOrderAction({
        onSuccess: resetTable,
        rows: rows.map(el => el.id),
        session,
        updateMessage
    });

    useEffect(() => {
        action.uncheckAll();
        void row.onClick(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, searchValue]);

    const { skeleton, table } = useOrderGroupedByDayDataGrid({
        rows,
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
        columns,
        isFetching,
        totalCount,
        search,
        row,
        sort: { sortName, sortDirection },
        action,
        message: { messageObj, resetMessage, updateMessage },
        mealPdf,
        labelsPdf
    };
}
export default useOrderByDayTable;

