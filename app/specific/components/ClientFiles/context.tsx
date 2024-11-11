import type useClientFilesTable from '@root/app/specific/components/ClientFiles/useClientFilesTable';
import { createGenericContext } from '@root/app/specific/lib/contextGenerator';

type UseTable = ReturnType<typeof useClientFilesTable>;

const {
    ContextProvider: ClientFilesTableContextProvider,
    useGenericContext: useClientFilesTableContext
} = createGenericContext<UseTable>(
    "ClientFilesTableContext",
    "useClientFilesTableContext must be used within a ClientFilesTableContextProvider"
);

export { ClientFilesTableContextProvider, useClientFilesTableContext };