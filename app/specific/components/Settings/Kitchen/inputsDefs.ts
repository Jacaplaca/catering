import { type kitchenSettingsValidator } from '@root/app/validators/specific/settings';
import { type InputsBulkType } from '@root/types';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';
import { type z } from 'zod';

const kitchenSettingsInputsDefs = <TFieldValues extends FieldValues>(form: UseFormReturn<TFieldValues>) => {

    const inputs: InputsBulkType<keyof z.infer<typeof kitchenSettingsValidator>>[] = [
        {
            label: 'settings:kitchen',
            name: 'name',
            placeholder: 'settings:name_kitchen_placeholder',
            type: 'text',
            message: form.formState.errors.name?.message
                ? ['shared:min_characters', form.formState.errors.name?.message as string ?? '']
                : undefined,
            isHorizontal: true,
        },
    ];

    return inputs;

}

export default kitchenSettingsInputsDefs;