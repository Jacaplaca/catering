'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
} from '../ui/form';
import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from "app/trpc/react";
import { changeEmailValidator } from 'app/validators/user';
import { useState, type FunctionComponent } from 'react';
import AuthInput from '@root/app/_components/ui/Inputs/AuthInput';
import InputsWrapper from '@root/app/_components/ui/Inputs/InputsWrapper';
import FormWrapper from '@root/app/_components/ui/form/Wrapper';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import { type Session } from 'next-auth';
import InputStandard from '@root/app/_components/ui/Inputs/Standard';
import Message from '@root/app/_components/ui/form/Message';
import translate from '@root/app/lib/lang/translate';

const FormSchema = changeEmailValidator

const ChangeEmailForm: FunctionComponent<{
  session: Session,
  dictionary: Record<string, string>,
  lang: LocaleApp,
}> = ({ dictionary, lang, session }) => {
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lang,
      email: session?.user?.email ?? "",
    },
  });

  const submitFunction = api.user.changeEmailRequest

  const isEmailDifferent = session?.user?.email !== form.getValues('email');

  const changeEmail = submitFunction.useMutation({
    onSuccess: () => {
      setSuccess(true)
      form.reset()
    },
    onError: (error) => {
      console.log(error.data, error.message, error.shape);
    }
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    changeEmail.mutate(values);
  };


  return (
    <FormWrapper
      label={translate(dictionary, 'change-email:form-label')}
      className='max-w-[780px]'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} >
          <InputsWrapper className='mb-8'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <AuthInput
                  message={translate(dictionary, form.formState.errors.email?.message)}
                  label={translate(dictionary, 'change-email:email_input_label')}
                >
                  <InputStandard
                    placeholder={session?.user?.email ?? ""}
                    type='email'
                    {...field}
                    id='email'
                  />
                </AuthInput>
              )}
            />


          </InputsWrapper>

          <MyButton
            className='w-full'
            type='submit'
            onClick={form.handleSubmit(onSubmit)}
            id='create-account-button'
            ariaLabel={translate(dictionary, 'change-email:change_email_button')}
            loading={changeEmail.isPending}
            disabled={changeEmail.isPending || !isEmailDifferent}
          >
            {translate(dictionary, 'change-email:change_email_button')}
          </MyButton>
          <div className='py-6'>
            <Message
              show={!!changeEmail.error?.message}
              status='error'
              message={changeEmail.error?.message}
            />
            <Message
              show={success}
              status="success"
              message={translate(dictionary, 'change-email:change_email_success')} />
          </div>
        </form>
      </Form>
    </FormWrapper>
  );

};

export default ChangeEmailForm;
