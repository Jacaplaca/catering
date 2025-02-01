import { type clientSettingsValidator } from '@root/app/validators/specific/settings';
import { type InputsBulkType } from '@root/types';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';
import { type z } from 'zod';

const clientSettingsInputsDefs = <TFieldValues extends FieldValues>(form: UseFormReturn<TFieldValues>) => {

    const inputs: InputsBulkType<keyof z.infer<typeof clientSettingsValidator>>[] = [
        {
            label: 'settings:place_name',
            name: 'name',
            placeholder: 'settings:place_name_placeholder',
            type: 'text',
            message: form.formState.errors.name?.message
                ? ['shared:min_characters', form.formState.errors.name?.message as string ?? '']
                : undefined,
            isHorizontal: true,
        },
        // {
        //     label: 'settings:last_order_time',
        //     name: 'lastOrderTime',
        //     placeholder: '11:00',
        //     type: 'time',
        //     message: "settings:edited_by_catering_only",
        //     isHorizontal: true,
        //     disabled: true
        // },
    ];

    return inputs;

}

export default clientSettingsInputsDefs;