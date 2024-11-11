import { type dieticianSettingsValidator } from '@root/app/validators/specific/settings';
import { type InputsBulkType } from '@root/types';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';
import { type z } from 'zod';

const dieticianSettingsInputsDefs = <TFieldValues extends FieldValues>(form: UseFormReturn<TFieldValues>) => {

    const inputs: InputsBulkType<keyof z.infer<typeof dieticianSettingsValidator>>[] = [
        {
            label: 'settings:dietician',
            name: 'name',
            placeholder: 'settings:name_surname_dietician_placeholder',
            type: 'text',
            message: form.formState.errors.name?.message
                ? ['shared:min_characters', form.formState.errors.name?.message as string ?? '']
                : undefined,
            isHorizontal: true,
        },
    ];

    return inputs;

}

export default dieticianSettingsInputsDefs;