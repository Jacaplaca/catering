'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
} from '../ui/form';
import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from "app/trpc/react";
import { userCreateValidator } from 'app/validators/user';
import { type FunctionComponent, useState } from 'react';
import InfoWithLink from '@root/app/_components/ui/form/InfoWithLink';
import AuthInput from '@root/app/_components/ui/Inputs/AuthInput';
import InputsWrapper from '@root/app/_components/ui/Inputs/InputsWrapper';
import FormWrapper from '@root/app/_components/ui/form/Wrapper';
import InputStandard from '@root/app/_components/ui/Inputs/Standard';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import PasswordRequirements from '@root/app/_components/ui/form/PasswordRequirements';
import WithInfoWrapper from '@root/app/_components/ui/form/WithInfoWrapper';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Message from '@root/app/_components/ui/form/Message';
import translate from '@root/app/lib/lang/translate';
import makeHref from '@root/app/lib/url/makeHref';
import { type SettingParsedType } from '@root/types';
// import AuthButton from '@root/app/_components/ui/buttons/Auth';
// import Or from '@root/app/_components/ui/form/Or';

const FormSchema = userCreateValidator;

const SignUpForm: FunctionComponent<{
  lang: LocaleApp
  dictionary: Record<string, string>,
  settings: SettingParsedType,
  children?: React.ReactNode
  info?: string | null
  tokenError?: string | null
  authErrors: Record<string, string>
}> = ({ lang, dictionary, settings, children, info, tokenError, authErrors }) => {
  const [password, setPassword] = useState('');

  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite');

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lang,
      email: '',
      password: '',
      confirmPassword: '',
      inviteToken,
    },
  });

  const createUser = api.user.create.useMutation({
    onSuccess: (got) => {
      console.log(got);
    },
    onError: (error) => {
      console.log(error.data, error.message, error.shape);
    }
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    const objToSubmit = {
      ...values,
      confirmPassword: values.confirmPassword
    }
    createUser.mutate(objToSubmit);
    (inviteToken && !tokenError) && Cookies.set('inviteToken', inviteToken, { expires: .0006944, secure: true, sameSite: 'Strict' });

  };

  const oneCol = !children;

  const getMessage = () => {
    if (createUser.data && createUser.data.isFirstSuperAdmin === false) {
      return <div className='flex flex-col items-start'>
        <h5 className='text-left font-bold'>{translate(dictionary, 'sign-up:user_created')}</h5>
        <p>{translate(dictionary, 'sign-up:check_email')}</p>
      </div>
    }
    if (createUser.data?.isFirstSuperAdmin === true) {
      return <div className='flex flex-col items-start'>
        <p>{translate(dictionary, 'sign-up:welcome_super_admin')}</p>
      </div>
    }
    if (tokenError) {
      return <div className='flex flex-col items-start'>
        <p>{tokenError}</p>
      </div>
    }
    if (info) {
      return <div className='flex flex-col items-start'>
        <p>{info}</p>
      </div>
    }
    return ""
  }

  const getStatus = (): 'error' | 'info' | 'success' => {
    if (createUser.data) {
      return 'success'
    }
    if (tokenError) {
      return 'error'
    }
    return 'info'
  }

  return (
    <FormWrapper
      className={oneCol ? '' : `lg:max-w-[780px]`}
      info={getMessage()}
      status={getStatus()}
    >
      <WithInfoWrapper
        // header={createUser.data
        //   ? <Message
        //     show={true}
        //     status='success'
        //     message={<div className='flex flex-col items-center'>
        //       <h4>{translate(dictionary, 'sign-up:user_created')}</h4>
        //       <p>{translate(dictionary, 'sign-up:check_email')}</p>
        //     </div>}
        //   />
        //   : null}
        oneCol={oneCol}
      >
        <div className='auth-form'>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <InputsWrapper className='mb-8'>
                <FormField
                  control={form.control}
                  // error={form.formState.errors.email?.message ?? "ASdf"}
                  name='email'
                  render={({ field }) => (
                    <AuthInput
                      label={translate(dictionary, 'sign-up:email_input_label')}
                      message={translate(authErrors, form.formState.errors.email?.message)}
                    >
                      <InputStandard
                        placeholder={translate(dictionary, 'sign-up:email_input_placeholder')}
                        type='email'
                        {...field}
                        id='email'
                      // autoComplete='off'
                      />
                    </AuthInput>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <AuthInput
                      label={translate(dictionary, 'sign-up:password_input_label')}
                      message={translate(authErrors, form.formState.errors.password?.message)}
                    >
                      <InputStandard
                        placeholder={translate(dictionary, 'sign-up:password_input_placeholder')}
                        {...field}
                        type='password'
                        id='password'
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
                      label={translate(dictionary, 'sign-up:password_input_label_re')}
                      message={translate(authErrors, form.formState.errors.confirmPassword?.message)}
                    >
                      <InputStandard
                        placeholder={translate(dictionary, 'sign-up:password_input_placeholder_re')}
                        {...field}
                        id='confirmPassword'
                        type='password'
                      />
                    </AuthInput>
                  )}
                />
              </InputsWrapper>

              {password ? <PasswordRequirements
                dictionary={authErrors}
                settings={settings}
                password={form.getValues('password')}
              /> : null}

              <Message
                show={!!createUser.error?.message}
                status='error'
                message={createUser.error?.message} />

              <MyButton
                className='w-full mt-2'
                type='submit'
                onClick={form.handleSubmit(onSubmit)}
                id='create-account-button'
                ariaLabel={translate(dictionary, 'sign-up:sign_up_button')}
                loading={createUser.isPending}
              >
                {translate(dictionary, 'sign-up:sign_up_button')}
              </MyButton>

            </form>
            {/* TODO after accepting site by google */}
            {/* <Or label={translate(dictionary, 'shared:or')} /> */}
            {/* <div className='flex flex-col gap-5' >
              <AuthButton

                provider='google'
                label={translate(dictionary, 'sign-up:sign_up_with_google')}
                icon='fab fa-google'
                inviteToken={inviteToken}
              />
            </div> */}
            <InfoWithLink
              info={translate(dictionary, 'sign-up:already_have_account_info')}
              links={[
                {
                  href: makeHref({ lang, page: 'sign-in' }),
                  label: translate(dictionary, 'sign-up:already_have_account_link'),
                }
              ]}
            />
          </Form>
        </div>
        {children}
      </WithInfoWrapper>
    </FormWrapper>
  );

};

export default SignUpForm;
