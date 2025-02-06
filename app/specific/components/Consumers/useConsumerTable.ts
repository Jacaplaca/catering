import { type RoleType } from '@prisma/client';
import useTableColumns from '@root/app/hooks/clipboard/useTableColumns';
import useRows from '@root/app/hooks/table/useRows';
import useTableSort from '@root/app/hooks/table/useTableSort';
import useMessage from '@root/app/hooks/useMessage';
import useSearch from '@root/app/hooks/useSearch';
import useConsumerColumns from '@root/app/specific/components/Consumers/useColumns';
import useConsumersDataGrid from '@root/app/specific/components/Consumers/useDataGrid';
import useFetchConsumers from '@root/app/specific/components/Consumers/useFetch';
import useFilterConsumers from '@root/app/specific/components/Consumers/useFilter';
import useCustomerRow from '@root/app/specific/components/Consumers/useRow';
import useConsumerAction from '@root/app/specific/components/Consumers/useRowAction';
import { type SettingParsedType } from '@root/types';
import { type ConsumerCustomTable, type ConsumersSortName } from '@root/types/specific';
import { useEffect } from 'react';

const useConsumerTable = ({
    lang,
    pageName,
    settings,
    dictionary,
    clientId,
    userRole
}: {
    lang: LocaleApp,
    pageName: string,
    settings: { main: SettingParsedType },
    dictionary: Record<string, string>,
    clientId?: string,
    userRole?: RoleType
}) => {
    const { messageObj, resetMessage, updateMessage } = useMessage(dictionary);
    const { sort, sortDirection, sortName } = useTableSort<ConsumersSortName>("name")

    const { searchValue: customerSearchValue, search: customerSearch } = useSearch({ lang, pageName });
    const { searchValue: dietSearchValue, search: dietSearch } = useSearch({ lang, pageName });

    const filter = useFilterConsumers({ lang, pageName });

    const allColumns = useConsumerColumns({ sort });

    const { showColumns, toggleColumn, columns } = useTableColumns({ key: 'consumers_columns', allColumns });

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
    } = useFetchConsumers({
        clientId: filter.clients.clientForFilter?.id,
        columns,
        showColumns,
        customerSearchValue,
        dietSearchValue,
        sortName,
        sortDirection,
        clientPlaceId: clientId
    });


    const [rows, setRows] = useRows<ConsumerCustomTable>(fetchedRows);

    const rowClick = useCustomerRow({ setRows, refetchAll: resetTable, updateMessage, resetMessage, dictionary });

    const action = useConsumerAction({
        onSuccess: resetTable,
        rows: rows.map(el => el.id),
    });

    useEffect(() => {
        action.uncheckAll();
        void rowClick.onRowClick(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, customerSearchValue, dietSearchValue]);


    const { skeleton, table } = useConsumersDataGrid({
        rows,
        idsChecked: action.idsChecked,
        toggleCheck: action.toggleCheck,
        searchValue: customerSearchValue,
        limit,
        totalCount,
        columns,
        userRole
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
        columns: { columns, showColumns, toggleColumn },
        isFetching,
        totalCount,
        search: { customerSearch, dietSearch },
        rowClick,
        sort: { sortName, sortDirection },
        action,
        filter,
        message: { messageObj, resetMessage, updateMessage },
        userRole
    }
};
export default useConsumerTable;