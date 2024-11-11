'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
} from '../ui/form';
import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, signOut } from 'next-auth/react';
import { loginValidator } from 'app/validators/user';
import { type FunctionComponent, useState, useEffect } from 'react';
import InfoWithLink from '@root/app/_components/ui/form/InfoWithLink';
import AuthInput from '@root/app/_components/ui/Inputs/AuthInput';
import InputsWrapper from '@root/app/_components/ui/Inputs/InputsWrapper';
import FormWrapper from '@root/app/_components/ui/form/Wrapper';
import InputStandard from '@root/app/_components/ui/Inputs/Standard';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import Or from '@root/app/_components/ui/form/Or';
import { type Locale } from '@root/i18n-config';
import { useSearchParams } from 'next/navigation'
import WithInfoWrapper from '@root/app/_components/ui/form/WithInfoWrapper';
import Message from '@root/app/_components/ui/form/Message';
import { type Session } from 'next-auth';
import translate from '@root/app/lib/lang/translate';
import makeHref from '@root/app/lib/url/makeHref';
// import AuthButton from '@root/app/_components/ui/buttons/Auth';

const FormSchema = loginValidator

const SignInForm: FunctionComponent<{
  dictionary: Record<string, string>;
  lang: Locale;
  redirectUrl: string;
  children: React.ReactNode
  session: Session | null
}> = ({ dictionary, lang, redirectUrl, children, session }) => {
  const searchParams = useSearchParams();
  const firstTimeLoginOnEmail = searchParams.has('emailVerified');
  const tokenNotFound = searchParams.has('tokenNotFound');
  const [error, setError] = useState<{
    type: 'error' | 'warning' | 'success' | 'info' | undefined,
    message: string
  }>({
    type: undefined,
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    session && void signOut()
  }, [firstTimeLoginOnEmail, session])

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log('onSubmit', values)
    setIsLoading(true)
    const singInData = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
      lang
    })

    if (singInData?.error) {
      console.log('singInData?.error', singInData?.error)
      switch (singInData?.error) {
        case 'CredentialsSignin':
          setError({ message: translate(dictionary, "sign-in:error_credentials"), type: 'error' })
          break;
        case "emailNotVerified":
          setError({ message: translate(dictionary, 'sign-in:error_email_not_verified'), type: "warning" })
          break;
        default:
          setError({ message: translate(dictionary, singInData?.error), type: 'error' })
          break;
      }
      setIsLoading(false)
    } else {
      window.location.href = redirectUrl === "/" ? makeHref({ lang, page: 'dashboard' }, true) : redirectUrl
    }

  };

  const oneCol = !children;

  return (<FormWrapper
    info={tokenNotFound ? translate(dictionary, 'sign-in:token_not_valid') : undefined}
    status='error'
    className={oneCol ? '' : `lg:max-w-[780px]`}
  >
    <WithInfoWrapper oneCol={oneCol}>
      <div className='sign-in-form auth-form'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            {/* TODO add after accept by google */}
            {/* <div className='flex flex-col gap-5' >
              <AuthButton
                provider='google'
                label={translate(dictionary, 'sign-in:sign_in_with_google')}
                icon='fab fa-google'
                redirectUrl={redirectUrl}
              />
            </div> */}
            {/* <Or label={translate(dictionary, 'shared:or')} /> */}
            <InputsWrapper className='mb-8'>
              <Message
                show={firstTimeLoginOnEmail}
                status="success"
                message={translate(dictionary, 'sign-in:verified_message')} />
              <AuthInput
                label={translate(dictionary, 'sign-in:email_input_label')}
              >
                <InputStandard
                  name='email'
                  id='email'
                  placeholder={translate(dictionary, 'sign-in:email_input_placeholder')}
                  value={form.watch('email')}
                  onChange={(e) => form.setValue('email', e.target.value)}
                  type='email'
                />
              </AuthInput>

              <AuthInput
                label={translate(dictionary, 'sign-in:password_input_label')}
              >
                <InputStandard
                  name='password'
                  id='password'
                  value={form.watch('password')}
                  onChange={(e) => form.setValue('password', e.target.value)}
                  placeholder={translate(dictionary, 'sign-in:password_input_placeholder')}
                  type='password'
                />
              </AuthInput>
              <Message
                show={!!error.message}
                status='error'
                message={error.message} />
            </InputsWrapper>
            <MyButton
              className='w-full'
              loading={isLoading}
              onClick={form.handleSubmit(onSubmit)}
              id='sign-in-button'
              ariaLabel={translate(dictionary, 'sign-in:sign_in_button')}
            >
              {translate(dictionary, 'sign-in:sign_in_button')}
            </MyButton>
            <InfoWithLink
              info={translate(dictionary, 'sign-in:reset_info')}
              links={[
                { href: makeHref({ lang, page: 'reset-password' }), label: translate(dictionary, 'sign-in:reset_link') }
              ]}
            />
            <Or
              label={translate(dictionary, 'shared:or')}
            />

            <MyButton
              className='w-full'
              onClick={() => window.location.href = makeHref({ lang, page: 'sign-up' })}
              id='sign-up-button'
              ariaLabel={translate(dictionary, 'sign-in:create_account_button')}
            >
              {translate(dictionary, 'sign-in:create_account_button')}
            </MyButton>

            <div className='h-5' />

            <InfoWithLink
              info={translate(dictionary, 'sign-in:terms_info')}
              links={[
                { href: makeHref({ lang, page: 'conditions' }), label: translate(dictionary, 'terms_link_1') },
                { href: makeHref({ lang, page: "privacy-policy" }), label: translate(dictionary, 'terms_link_2') }
              ]}
            />
          </form>
        </Form>
      </div>
      {children}
    </WithInfoWrapper>
  </FormWrapper>
  );
};

export default SignInForm;
