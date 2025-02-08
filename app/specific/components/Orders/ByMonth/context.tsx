import type useOrderByMonthTable from '@root/app/specific/components/Orders/ByMonth/useOrderTable';
import { createGenericContext } from '@root/app/specific/lib/contextGenerator';

type UseTable = ReturnType<typeof useOrderByMonthTable>;

const {
    ContextProvider: OrderByMonthTableContextProvider,
    useGenericContext: useOrderByMonthTableContext
} = createGenericContext<UseTable>(
    "OrderByMonthTableContext",
    "useOrderByMonthTableContext must be used within a OrderByMonthTableContextProvider"
);

export { OrderByMonthTableContextProvider, useOrderByMonthTableContext };