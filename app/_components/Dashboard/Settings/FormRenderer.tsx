'use client';

import { type BaseSyntheticEvent } from 'react';
import { Form } from '@root/app/_components/ui/form';
import translate from '@root/app/lib/lang/translate';
import Buttons from '@root/app/_components/ui/form/Buttons';
import Message from '@root/app/_components/ui/form/Message';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';

type FormProps<TFieldValues extends FieldValues> = {
    form: UseFormReturn<TFieldValues>;
    children: React.ReactNode;
    onSubmit: (e?: BaseSyntheticEvent<object, unknown, unknown> | undefined) => Promise<void>
    hasFinishedSettings?: boolean;
    dictionary: Record<string, string>;
};

const SettingsFormRenderer = <TFieldValues extends FieldValues>({
    dictionary,
    children,
    form,
    onSubmit,
    hasFinishedSettings
}: FormProps<TFieldValues>) => {

    return (
        <Form {...form} >
            <form onSubmit={onSubmit} className='relative space-y-8 ' >
                <Message
                    show={!hasFinishedSettings}
                    className='w-fit'
                    status='warning'
                    message={translate(dictionary, 'settings:fill_to_use')}
                />
                {children}
                <Buttons
                    cancelLabel={translate(dictionary, 'shared:cancel')}
                    onCancel={() => form.reset()}
                    submitLabel={translate(dictionary, 'shared:save')}
                    onSubmit={onSubmit}
                />
            </form>
        </Form>
    );
};

export default SettingsFormRenderer;
