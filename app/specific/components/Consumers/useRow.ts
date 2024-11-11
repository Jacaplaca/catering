import { zodResolver } from '@hookform/resolvers/zod';
import { type UpdateMessageType } from '@root/app/hooks/useMessage';
import translate from '@root/app/lib/lang/translate';
import { api } from '@root/app/trpc/react';
import { consumerEditValidator } from '@root/app/validators/specific/consumer';
import { type ConsumerCustomTable } from '@root/types/specific';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

const FormSchema = consumerEditValidator;


const defaultValues = {
    id: '',
    name: '',
    code: '',
    client: { name: '', id: '', code: '' },
    notes: '',
    diet: {
        code: '',
        description: '',
    }
};

const useCustomerRow = ({
    setRows,
    refetchAll,
    updateMessage,
    resetMessage,
    dictionary
}: {
    setRows: Dispatch<SetStateAction<ConsumerCustomTable[]>>
    refetchAll: () => Promise<void>
    updateMessage: UpdateMessageType,
    resetMessage: () => void
    dictionary: Record<string, string>
}) => {
    const [defaultForm, setDefaultForm] = useState<z.infer<typeof FormSchema>>(defaultValues);
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

    const { data: fullConsumer, refetch: fullConsumerRefetch, isFetching: fullConsumerFetching }
        = api.specific.consumer.getOne.useQuery(
            { id: expandedRowId ?? '' },
            { enabled: Boolean(expandedRowId) }
        );

    function chooseClient(id: string | null, allItems: { id: string, name: string, code: string }[]) {
        if (!id) {
            form.setValue('client', { name: '', id: '', code: '' }, { shouldValidate: true, shouldDirty: true });
            return;
        }
        const client = allItems.find(item => item.id === id)
        form.setValue('client', { name: client?.name ?? '', id: client?.id ?? '', code: client?.code ?? '' }, { shouldValidate: true, shouldDirty: true });
    }

    const [consumerData, setConsumerData] = useState<ConsumerCustomTable | null>(null);

    useEffect(() => {
        if (fullConsumer) {
            setConsumerData(fullConsumer);
        }
    }, [fullConsumer]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultForm,
    });

    useEffect(() => {
        // resetMessage();
        if (consumerData && expandedRowId) {
            const consumer = {
                id: consumerData?.id ?? '',
                code: consumerData?.code ?? '',
                name: consumerData?.name ?? '',
                client: { name: consumerData?.client?.name ?? '', id: consumerData?.client?.id ?? '', code: consumerData?.client?.code ?? '' },
                notes: consumerData?.notes ?? '',
                diet: {
                    code: consumerData?.diet?.code ?? '',
                    description: consumerData?.diet?.description ?? '',
                }
            };
            form.reset(consumer);
            setDefaultForm(consumer);
            form.setValue('client',
                { name: consumer.client.name, id: consumer.client.id, code: consumer.client.code },
                { shouldValidate: true, shouldDirty: true });
        } else if (!expandedRowId) {
            form.reset(defaultValues);
            setDefaultForm(defaultValues);
        }
    }, [consumerData, form, expandedRowId]);

    useEffect(() => {
        resetMessage();
    }, [expandedRowId, resetMessage]);


    useEffect(() => {
        if (fullConsumer && expandedRowId) {
            setRows((state) => {
                return state.map((row) => {
                    if (row.id === fullConsumer.id) {
                        return fullConsumer;
                    }
                    return row;
                });
            });
        }
    }, [fullConsumer, setRows, expandedRowId]);

    const submitFunction = expandedRowId
        ? api.specific.consumer.edit
        : api.specific.consumer.addOne;

    const update = submitFunction.useMutation({
        onSuccess: async () => {
            expandedRowId
                ? await fullConsumerRefetch()
                : await refetchAll();
            updateMessage('saved');
        },
        onError: (error) => {
            console.log(error.data, error.message, error.shape);
            updateMessage({ content: translate(dictionary, error.message), status: 'error' });
        },
    });

    const onSubmit = (values: z.infer<typeof FormSchema>) => {
        updateMessage('saving');
        update.mutate(values);
    };

    const onRowClick = (key: string | null) => {
        setExpandedRowId(state => state === key ? null : key);
        form.reset(defaultValues);
    };

    return {
        onRowClick,
        expandedRowId,
        update,
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isFetching: fullConsumerFetching,
        formData: defaultForm,
        clients: {
            chooseClient,
        }
    };
};

export default useCustomerRow;