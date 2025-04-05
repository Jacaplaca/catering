import type useByClientAndMonthTable from '@root/app/specific/components/Orders/ByClientAndMonth/useByClientAndMonthTable';
import { createGenericContext } from '@root/app/specific/lib/contextGenerator';

type UseTable = ReturnType<typeof useByClientAndMonthTable>;

const {
    ContextProvider: ByClientAndMonthTableContextProvider,
    useGenericContext: useByClientAndMonthTableContext
} = createGenericContext<UseTable>(
    "ByClientAndMonthTableContext",
    "useByClientAndMonthTableContext must be used within a ByClientAndMonthTableContextProvider"
);

export { ByClientAndMonthTableContextProvider, useByClientAndMonthTableContext };