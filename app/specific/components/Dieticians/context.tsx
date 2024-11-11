import type useDieticianTable from '@root/app/specific/components/Dieticians/useDieticianTable';
import { createGenericContext } from '@root/app/specific/lib/contextGenerator';

type UseTable = ReturnType<typeof useDieticianTable>;

const {
    ContextProvider: DieticianTableContextProvider,
    useGenericContext: useDieticianTableContext
} = createGenericContext<UseTable>(
    "TableContext",
    "useTableContext must be used within a DieticianTableContextProvider"
);

export { DieticianTableContextProvider, useDieticianTableContext };