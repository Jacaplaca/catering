'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
} from '../ui/form';
import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordValidator } from 'app/validators/user';
import { Alert } from 'react-daisyui';
import InfoWithLink from '@root/app/_components/ui/form/InfoWithLink';
import { api } from "app/trpc/react";
import InputsWrapper from '@root/app/_components/ui/Inputs/InputsWrapper';
import FormWrapper from '@root/app/_components/ui/form/Wrapper';
import InputStandard from '@root/app/_components/ui/Inputs/Standard';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import { useState, type FunctionComponent } from 'react';
import FormSuccess from '@root/app/_components/ui/form/FormSuccess';
import translate from '@root/app/lib/lang/translate';
import makeHref from '@root/app/lib/url/makeHref';

const FormSchema = resetPasswordValidator

const ResetPasswordForm: FunctionComponent<{
  dictionary: Record<string, string>;
  lang: LocaleApp
}> = ({ dictionary, lang }) => {
  const [done, setDone] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      lang
    },
  });

  const resetPassword = api.user.resetPassword.useMutation({
    onMutate: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDone(true);
    },
    onSuccess: (got) => {
      console.log(got);
    },
    onError: (error) => {
      console.log(error.data, error.message, error.shape);
    }
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    resetPassword.mutate(values);
  };

  if (done) {
    return (
      <FormSuccess
        title={translate(dictionary, 'reset-password:reset_password_success')}
        icon={`fas fa-envelope`}
      />
    )
  }

  return (
    <FormWrapper label={translate(dictionary, "reset-password:form-label")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <InputsWrapper className='mb-8'>
            <InputStandard
              name='email'
              id='email'
              placeholder={translate(dictionary, "reset-password:email_input_placeholder")}
              value={form.watch('email')}
              onChange={(e) => form.setValue('email', e.target.value)}
              type='email'
            />
          </InputsWrapper>
          {resetPassword.error && (
            <Alert
              status='warning'
              className='mt-4'
              icon={<i className='fas fa-exclamation-triangle'></i>}
            >
              {resetPassword.error.message}
            </Alert>
          )}
          <MyButton
            className='w-full mt-2'
            loading={resetPassword.isPending}
            type='submit'
            id='sign-in-button'
            ariaLabel={'sign_in_button'}
          >
            {translate(dictionary, 'reset-password:reset_password_button')}
          </MyButton>
          <InfoWithLink
            info={translate(dictionary, 'reset-password:reset_password_info')}
            links={[
              {
                href: makeHref({ lang, page: 'sign-in' }),
                label: translate(dictionary, 'reset-password:reset_password_link')
              }
            ]}
          />
        </form>
      </Form>
    </FormWrapper>
  );
};

export default ResetPasswordForm;
