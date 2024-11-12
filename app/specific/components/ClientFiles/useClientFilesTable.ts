import { type ClientFileType } from '@prisma/client';
import useRows from '@root/app/hooks/table/useRows';
import useTableSort from '@root/app/hooks/table/useTableSort';
import useMessage from '@root/app/hooks/useMessage';
import useSearch from '@root/app/hooks/useSearch';
import useClientFilesColumns from '@root/app/specific/components/ClientFiles/useColumns';
import useClientFilesDataGrid from '@root/app/specific/components/ClientFiles/useDataGrid';
import useFetchWeekFilesList from '@root/app/specific/components/ClientFiles/useFetch';
import useClientsFilesFilter from '@root/app/specific/components/ClientFiles/useFilter';
import useGrouper from '@root/app/specific/components/ClientFiles/useGrouper';
import useClientFilesAction from '@root/app/specific/components/ClientFiles/useRowAction';
import useUploadFiles from '@root/app/specific/components/ClientFiles/useUploadFiles';
import { type saveClientsFiles } from '@root/app/validators/specific/clientFiles';
import { type SettingParsedType } from '@root/types';
import { type ClientFilesSortName, type ClientFilesCustomTable } from '@root/types/specific';
import { useEffect } from 'react';
import { type z } from 'zod';

const useClientFilesTable = ({
    lang,
    pageName,
    settings,
    dictionary,
}: {
    lang: LocaleApp,
    pageName: string,
    settings: { main: SettingParsedType, clientFiles: SettingParsedType },
    dictionary: Record<string, string>,
}) => {
    const { messageObj, resetMessage, updateMessage } = useMessage(dictionary);
    const { sort, sortDirection, sortName } = useTableSort<ClientFilesSortName>("name")
    const { searchValue, search } = useSearch({ lang, pageName });
    const filter = useClientsFilesFilter({ lang, pageName });

    const grouper = useGrouper({
        day: filter.week.dayOfWeek,
        clientFiles: settings.clientFiles,
        updateMessage,
        dictionary,
        onSave: onSaveFiles
    });

    const columns = useClientFilesColumns({
        dictionary,
        sort,
        fileTypes: settings.clientFiles.type as ClientFileType[],
        openGrouper: grouper.openFileType,
    });

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
    } = useFetchWeekFilesList({
        day: filter.week.dayOfWeek,
        columns,
        searchValue,
        sortName,
        sortDirection,
    });

    const [rows, , updateRow] = useRows<ClientFilesCustomTable>(fetchedRows);

    const uploadFiles = useUploadFiles({ updateRow, updateMessage, dictionary, day: filter.week.dayOfWeek });

    function onSaveFiles(data: z.infer<typeof saveClientsFiles>) {
        uploadFiles.onSave(data);
    }

    const action = useClientFilesAction({
        onSuccess: resetTable,
        rows: rows.map(el => el.id),
        day: filter.week.dayOfWeek,
        updateMessage,
    });

    useEffect(() => {
        action.uncheckAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, searchValue]);


    const { skeleton, table } = useClientFilesDataGrid({
        rows,
        idsChecked: action.idsChecked,
        toggleCheck: action.toggleCheck,
        searchValue,
        limit,
        totalCount,
        columns,
        fileTypes: settings.clientFiles.type as ClientFileType[]
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
        sort: { sortName, sortDirection },
        action,
        filter,
        uploadFiles,
        grouper,
        message: { messageObj, resetMessage, updateMessage }
    }
};
export default useClientFilesTable;