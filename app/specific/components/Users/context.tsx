import type useUserTable from '@root/app/specific/components/Users/useUserTable';
import { createGenericContext } from '@root/app/specific/lib/contextGenerator';

type UseTable = ReturnType<typeof useUserTable>;

const {
    ContextProvider: TableContextProvider,
    useGenericContext: useTableContext
} = createGenericContext<UseTable>(
    "TableContext",
    "useTableContext must be used within a TableContextProvider"
);

export { TableContextProvider, useTableContext };