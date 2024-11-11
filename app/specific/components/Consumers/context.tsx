import type useConsumerTable from '@root/app/specific/components/Consumers/useConsumerTable';
import { createGenericContext } from '@root/app/specific/lib/contextGenerator';

type UseTable = ReturnType<typeof useConsumerTable>;

const {
    ContextProvider: ConsumerTableContextProvider,
    useGenericContext: useConsumerTableContext
} = createGenericContext<UseTable>(
    "TableContext",
    "useTableContext must be used within a ConsumerTableContextProvider"
);

export { ConsumerTableContextProvider, useConsumerTableContext };