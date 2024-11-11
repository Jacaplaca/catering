'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
} from '../ui/form';
import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type FunctionComponent, useState, useEffect } from 'react';
import AuthInput from '@root/app/_components/ui/Inputs/AuthInput';
import InputsWrapper from '@root/app/_components/ui/Inputs/InputsWrapper';
import FormWrapper from '@root/app/_components/ui/form/Wrapper';
import InputStandard from '@root/app/_components/ui/Inputs/Standard';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import { type Locale } from '@root/i18n-config';
import WithInfoWrapper from '@root/app/_components/ui/form/WithInfoWrapper';
import { contactFormValidator } from '@root/app/validators/contact';
import { api } from '@root/app/trpc/react';
import FormSuccess from '@root/app/_components/ui/form/FormSuccess';
import translate from '@root/app/lib/lang/translate';

const FormSchema = contactFormValidator;

const ContactForm: FunctionComponent<{
  dictionary: Record<string, string>;
  maxMessageLength: number;
  lang: Locale;
}> = ({ dictionary, maxMessageLength }) => {

  const [success, setSuccess] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      message: '',
    },
  });

  const sendMessage = api.contact.sendMessage.useMutation({
    onSuccess: (got) => {
      setSuccess(true);
      console.log(got);
    },
    onError: (error) => {
      console.log(error.data, error.message, error.shape);
    }
  });

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 3000000);
    }
  }, [success]);

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    sendMessage.mutate(values);
  };

  const backToForm = () => {
    setSuccess(false);
  };

  if (success) {
    return (
      <FormSuccess
        title={translate(dictionary, 'form-success')}
        icon='fas fa-check-circle'
        className='w-[320px]'
        handleBack={backToForm}
      />
    );
  }

  return (<FormWrapper className='max-w-[780px]' >
    <WithInfoWrapper>
      <div className='w-[320px]'>
        <Form {...form}>
          <InputsWrapper className='mb-8'>
            <AuthInput
              label={translate(dictionary, 'form-email-label')}
              message={translate(dictionary, form.formState.errors.email?.message)}
            >
              <InputStandard
                name='email'
                id='email'
                placeholder={translate(dictionary, 'form-email-placeholder')}
                value={form.watch('email')}
                onChange={(e) => form.setValue('email', e.target.value)}
                type='email'
              />
            </AuthInput>

            <AuthInput
              label={translate(dictionary, 'form-message-label')}
              message={translate(dictionary, form.formState.errors.message?.message)}
            >
              <InputStandard
                isTextArea
                rows={7}
                name='message'
                id='message'
                placeholder={translate(dictionary, 'form-message-placeholder')}
                value={form.watch('message')}
                onChange={(e) => form.setValue('message', e.target.value)}
                type='message'
                maxLength={maxMessageLength}
              />
            </AuthInput>

          </InputsWrapper>

          <MyButton
            className='w-full'
            loading={sendMessage.isPending}
            onClick={form.handleSubmit(onSubmit)}
            id='sign-in-button'
            ariaLabel={translate(dictionary, 'form-submit')}
          >
            {translate(dictionary, 'form-submit')}
          </MyButton>


        </Form>
      </div>
    </WithInfoWrapper>
  </FormWrapper>
  );
};

export default ContactForm;
