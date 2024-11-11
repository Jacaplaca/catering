import type useOrderByDayTable from '@root/app/specific/components/Orders/ByDay/useOrderTable';
import { createGenericContext } from '@root/app/specific/lib/contextGenerator';

type UseTable = ReturnType<typeof useOrderByDayTable>;

const {
    ContextProvider: OrderByDayTableContextProvider,
    useGenericContext: useOrderByDayTableContext
} = createGenericContext<UseTable>(
    "OrderByDayTableContext",
    "useOrderByDayTableContext must be used within a OrderByDayTableContextProvider"
);

export { OrderByDayTableContextProvider, useOrderByDayTableContext };