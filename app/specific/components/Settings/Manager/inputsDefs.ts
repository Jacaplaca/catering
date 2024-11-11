import { type managerSettingsValidator } from '@root/app/validators/specific/settings';
import { type InputsBulkType } from '@root/types';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';
import { type z } from 'zod';

const labelWidth = '270px';

const managerSettingsInputsDefs = <TFieldValues extends FieldValues>(form: UseFormReturn<TFieldValues>) => {

    const inputs: InputsBulkType<keyof z.infer<typeof managerSettingsValidator>>[] = [
        {
            label: 'settings:company_name',
            name: 'name',
            placeholder: 'settings:company_name_placeholder',
            type: 'text',
            message: form.formState.errors.name?.message
                ? ['shared:min_characters', form.formState.errors.name?.message as string ?? '']
                : undefined,
            isHorizontal: true,
            labelWidth
        },
        {
            label: 'settings:first_order_deadline',
            name: 'firstOrderDeadline',
            placeholder: '20:00',
            type: 'time',
            message: form.formState.errors.firstOrderDeadline?.message as string,
            isHorizontal: true,
            labelWidth
        },
        {
            label: 'settings:second_order_deadline',
            name: 'secondOrderDeadline',
            placeholder: '08:00',
            type: 'time',
            message: form.formState.errors.secondOrderDeadline?.message as string,
            isHorizontal: true,
            labelWidth
        },
        {
            label: 'settings:phone',
            name: 'phone',
            placeholder: 'settings:phone_placeholder',
            type: 'text',
            message: form.formState.errors.phone?.message as string,
            isHorizontal: true,
            labelWidth
        },
        {
            label: 'settings:email',
            name: 'email',
            placeholder: 'settings:email_placeholder',
            type: 'text',
            message: form.formState.errors.email?.message as string,
            isHorizontal: true,
            labelWidth
        }
    ];

    return inputs;

}

export default managerSettingsInputsDefs;