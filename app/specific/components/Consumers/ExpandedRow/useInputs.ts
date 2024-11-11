import { useConsumerTableContext } from '@root/app/specific/components/Consumers/context';
import { type consumerEditValidator } from '@root/app/validators/specific/consumer';
import { type InputsBulkType } from '@root/types';
import { type z } from 'zod';

const useConsumerInputs = () => {
    const { rowClick: { form } } = useConsumerTableContext()

    const inputs: InputsBulkType<keyof z.infer<typeof consumerEditValidator>>[] = [
        {
            label: 'consumers:code_column',
            name: 'code',
            placeholder: 'consumers:code_placeholder',
            type: 'text',
            message: form.formState.errors.code?.message,
            isHorizontal: true
        },
        {
            label: 'consumers:name_column',
            name: 'name',
            placeholder: 'consumers:name_placeholder',
            type: 'text',
            message: form.formState.errors.name?.message,
            isHorizontal: true
        },
        // {
        //     label: 'consumers:notes_column',
        //     name: 'notes',
        //     placeholder: 'consumers:notes_placeholder',
        //     type: 'text',
        //     message: form.formState.errors.notes?.message,
        //     isTextArea: true
        // },
        {
            label: 'consumers:diet.code_column',
            name: 'diet.code' as keyof z.infer<typeof consumerEditValidator>,
            placeholder: 'consumers:diet.code_placeholder',
            type: 'text',
            message: form.formState.errors.diet?.code?.message,
            isHorizontal: true
        },
        {
            label: 'consumers:diet.description_column',
            name: 'diet.description' as keyof z.infer<typeof consumerEditValidator>,
            placeholder: 'consumers:diet.description_placeholder',
            type: 'text',
            message: form.formState.errors.diet?.description?.message,
            isTextArea: true,
            isHorizontal: true
        }
    ];

    return inputs;
}

export default useConsumerInputs;