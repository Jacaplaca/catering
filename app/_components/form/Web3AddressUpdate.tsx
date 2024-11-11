'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
} from '../ui/form';
import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from "app/trpc/react";
import { web3AddressValidator } from 'app/validators/user';
import { useState, type FunctionComponent } from 'react';
import FormWrapper from '@root/app/_components/ui/form/Wrapper';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import { type Session } from 'next-auth';
import Message from '@root/app/_components/ui/form/Message';
import LongText from '@root/app/_components/ui/LongText';
import useMetamask from '@root/app/hooks/useMetamask';
import translate from '@root/app/lib/lang/translate';
import { type SettingParsedType } from '@root/types';

const FormSchema = web3AddressValidator

const Web3AddressUpdate: FunctionComponent<{
  session: Session,
  dictionary: Record<string, string>,
  lang: LocaleApp,
  settings: SettingParsedType
}> = ({ dictionary, lang, session, settings }) => {

  const [signing, setSigning] = useState(false);
  const { isMetamaskInstalled, message, connectMetamask } = useMetamask({ dictionary, settings })

  const web3Address = session.user.web3Address;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lang,
      signedMessage: 'empty'
    },
  });

  const submitFunction = api.user.changeWeb3Address

  const changeWeb3Address = submitFunction.useMutation({
    onSuccess: () => {
      form.reset();
      setSigning(false);
      window.location.reload();
    },
    onError: (error) => {
      setSigning(false);
      console.log(error.data, error.message, error.shape);
    }
  });

  const onSubmit = async () => {
    const signer = await connectMetamask({
      callStart: () => setSigning(true),
      callEnd: () => setSigning(false)
    });

    if (signer) {
      const metamaskTextToSign = translate(dictionary, 'signing_message')
      try {
        const sig = await signer.signMessage(metamaskTextToSign);
        changeWeb3Address.mutate({ signedMessage: sig, lang });
        return sig;
      } catch (error) {
        setSigning(false);
      }
    }
  }

  return (
    <FormWrapper
      label={translate(dictionary, 'add_address_label')}
      className='max-w-[780px]'
    >
      <Form {...form}>
        {web3Address ? null : <p className='mb-4'>{translate(dictionary, 'description_add_address')}</p>}
        {isMetamaskInstalled && <form onSubmit={form.handleSubmit(onSubmit)} className='mb-4' >
          {!!web3Address ? <LongText
            className='max-w-[300px]'
            text={web3Address ?? ''}
            ActionButton={() => <button
              type='submit'
              className="fa-regular fa-pen copy-button">
            </button>
            }
          />
            : <MyButton
              className='w-full'
              type='submit'
              id='change-web3-address'
              ariaLabel={translate(dictionary, 'add_address_button')}
              loading={signing || changeWeb3Address.isPending}
              disabled={signing}
            >
              {translate(dictionary, 'add_address_button')}
            </MyButton>
          }
        </form>}
        <Message
          show={message.text !== ''}
          status={message.status}
          message={message.text}
        />
      </Form>
    </FormWrapper>
  );

};

export default Web3AddressUpdate;






// 'use client';
// import { useState, type FunctionComponent } from 'react';

// const Web3test: FunctionComponent = () => {






//     return (

//     );
// };

// export default Web3test

