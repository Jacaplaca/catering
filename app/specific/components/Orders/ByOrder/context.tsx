import type useOrderTable from '@root/app/specific/components/Orders/ByOrder/useOrderTable';
import { createGenericContext } from '@root/app/specific/lib/contextGenerator';

type UseTable = ReturnType<typeof useOrderTable>;

const {
    ContextProvider: OrderTableContextProvider,
    useGenericContext: useOrderTableContext
} = createGenericContext<UseTable>(
    "OrderTableContext",
    "useOrderTableContext must be used within a OrderTableContextProvider"
);

export { OrderTableContextProvider, useOrderTableContext };