'use client';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
} from '../ui/form';
import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from "app/trpc/react";
import { createNewPasswordValidator } from 'app/validators/user';
import { type FunctionComponent, useState } from 'react';
import AuthInput from '@root/app/_components/ui/Inputs/AuthInput';
import InputsWrapper from '@root/app/_components/ui/Inputs/InputsWrapper';
import FormWrapper from '@root/app/_components/ui/form/Wrapper';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import FormSuccess from '@root/app/_components/ui/form/FormSuccess';
import { type Session } from 'next-auth';
import PasswordRequirements from '@root/app/_components/ui/form/PasswordRequirements';
import Message from '@root/app/_components/ui/form/Message';
import translate from '@root/app/lib/lang/translate';
import { type SettingParsedType } from '@root/types';
import InputStandard from '@root/app/_components/ui/Inputs/Standard';

const FormSchema = createNewPasswordValidator

const CreateNewPasswordForm: FunctionComponent<{
  session?: Session | null,
  token?: string,
  dictionary: Record<string, string>,
  lang: LocaleApp,
  isPage?: boolean,
  settings: SettingParsedType,
  authErrors: Record<string, string>
}> = ({ token, dictionary, lang, session, isPage, settings, authErrors }) => {
  const [, setPassword] = useState('');

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lang,
      token,
      password: '',
      confirmPassword: '',
    },
  });

  const submitFunction = session ? api.user.changePasswordSession : api.user.changePasswordToken

  const createNewPassword = submitFunction.useMutation({
    onSuccess: () => {
      form.reset()
    },
    onError: (error) => {
      console.log(error.data, error.message, error.shape);
    }
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    createNewPassword.mutate(values);
  };

  if (createNewPassword.data && isPage) {
    return (
      <FormSuccess
        title={createNewPassword.data}
        icon={`fa-solid fa-key`}
      />
    )
  }

  return (
    <FormWrapper
      label={translate(dictionary, 'change-password:form-label')}
      className='max-w-[780px]'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} >
          <InputsWrapper className='mb-8'>
            <FormField
              control={form.control}
              name='token'
              render={({ field }) => (
                <input
                  placeholder='token'
                  type='hidden'
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <AuthInput
                  label={translate(dictionary, 'change-password:password_input_label')}
                  message={translate(authErrors, form.formState.errors.password?.message)}
                >
                  <InputStandard
                    placeholder={translate(dictionary, 'change-password:password_input_placeholder')}
                    {...field}
                    id='password'
                    type='password'
                    onChange={(e) => {
                      setPassword(e.target.value)
                      field.onChange(e)
                    }}
                  />
                </AuthInput>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <AuthInput
                  label={translate(dictionary, 'change-password:password_input_label_re')}
                  message={translate(authErrors, form.formState.errors.confirmPassword?.message)}
                >
                  <InputStandard
                    placeholder={translate(dictionary, 'change-password:password_input_placeholder_re')}
                    {...field}
                    id='confirmPassword'
                    type='password'
                  />
                </AuthInput>
              )}
            />
          </InputsWrapper>
          <PasswordRequirements
            dictionary={authErrors}
            settings={settings}
            password={form.getValues('password')}
          />
          <MyButton
            className='w-full'
            type='submit'
            onClick={form.handleSubmit(onSubmit)}
            id='create-account-button'
            ariaLabel={translate(dictionary, 'change-password:change_password_button')}
            loading={createNewPassword.isPending}
          >
            {translate(dictionary, 'change-password:change_password_button')}
          </MyButton>
          <div className='py-6'>
            <Message
              show={!!createNewPassword.error?.message}
              status='error'
              message={createNewPassword?.error?.message}
            />
            <Message
              show={!!createNewPassword.data}
              status='success'
              message={createNewPassword.data}
            />
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
};

export default CreateNewPasswordForm;
