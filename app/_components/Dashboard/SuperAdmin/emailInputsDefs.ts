import { type updateEmailSettingsValid } from '@root/app/validators/settings';
import { type InputsBulkType } from '@root/types';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';
import { type z } from 'zod';

const superAdminEmailInputsDefs = <TFieldValues extends FieldValues>(form: UseFormReturn<TFieldValues>) => {

    const inputs: InputsBulkType<keyof z.infer<typeof updateEmailSettingsValid>>[] = [
        {
            label: 'settings:email_contact_admin',
            name: 'contactAdmin',
            type: 'text',
            message: form.formState.errors.contactAdmin?.message as string,
            isHorizontal: true
        },
        {
            label: 'settings:email_from',
            name: 'from',
            type: 'text',
            message: form.formState.errors.from?.message as string,
            isHorizontal: true
        },
        {
            label: 'settings:email_from_alias',
            name: 'fromAlias',
            type: 'text',
            message: form.formState.errors.fromAlias?.message as string,
            isHorizontal: true
        },
        {
            label: 'settings:email_from_activation',
            name: 'fromActivation',
            type: 'text',
            message: form.formState.errors.fromActivation?.message as string,
            isHorizontal: true
        },
        {
            label: 'settings:email_host',
            name: 'host',
            type: 'text',
            message: form.formState.errors.host?.message as string,
            isHorizontal: true
        },
        {
            label: 'settings:email_password',
            name: 'password',
            type: 'password',
            message: form.formState.errors.password?.message as string,
            isHorizontal: true
        },
        {
            label: 'settings:email_port',
            name: 'port',
            type: 'number',
            message: form.formState.errors.port?.message as string,
            isHorizontal: true
        },
        {
            label: 'settings:email_username',
            name: 'username',
            type: 'text',
            message: form.formState.errors.username?.message as string,
            isHorizontal: true
        },
        {
            label: 'settings:email_template_html_wrapper',
            name: 'templateHtmlWrapper',
            type: 'text',
            message: form.formState.errors.templateHtmlWrapper?.message as string,
            isHorizontal: true,
            isTextArea: true
        },
    ];

    return inputs;

}

export default superAdminEmailInputsDefs;