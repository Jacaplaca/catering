import type useKitchenTable from '@root/app/specific/components/Kitchens/useKitchenTable';
import { createGenericContext } from '@root/app/specific/lib/contextGenerator';

type UseTable = ReturnType<typeof useKitchenTable>;

const {
    ContextProvider: KitchensTableContextProvider,
    useGenericContext: useKitchensTableContext
} = createGenericContext<UseTable>(
    "TableContext",
    "useTableContext must be used within a KitchensTableContextProvider"
);

export { KitchensTableContextProvider, useKitchensTableContext };