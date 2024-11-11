'use client';
import { useState, type FunctionComponent, useEffect } from 'react';
import { api } from "app/trpc/react";
import Dropdown from '@root/app/_components/ui/Inputs/Dropdown';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import InputsWrapper from '@root/app/_components/ui/Inputs/InputsWrapper';
import AuthInput from '@root/app/_components/ui/Inputs/AuthInput';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import InputStandard from '@root/app/_components/ui/Inputs/Standard';
import Checkbox from '@root/app/_components/ui/Inputs/Checkbox';

import { sendInviteValidator } from '@root/app/validators/token';
import Message from '@root/app/_components/ui/form/Message';
import translate from '@root/app/lib/lang/translate';
import { type RoleType } from '@prisma/client';
import LinkCopy from '@root/app/_components/Dashboard/Settings/Invite/LinkCopy';
import { Form, FormField } from '@root/app/_components/ui/form';

type Props = {
    lang: LocaleApp
    dictionary: Record<string, string>,
    role?: RoleType
};

const FormSchema = sendInviteValidator
const someDummyEmail = 'email@example.com'

const Invite: FunctionComponent<Props> = ({ lang, dictionary, role }) => {

    const [sendEmail, setSendEmail] = useState(false);
    const [showSendSuccess, setShowSendSuccess] = useState(false)

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (showSendSuccess) {
            setTimeout(() => {
                setShowSendSuccess(false)
            }, 3000)
        }
    }, [showSendSuccess])

    const updateSendEmail = () => {
        sendEmail
            ? setTimeout(() => { form.setValue('email', someDummyEmail) }, 300)
            : form.setValue('email', '')
        setSendEmail(!sendEmail)
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: someDummyEmail,
            lang,
            role: role ? role : ''
        },
    });

    const { data: roles } = api.role.getRolesToInvite.useQuery({ lang })

    const sendInvitation = api.token.sendInvite.useMutation({
        onSuccess: (got) => {
            setShowSendSuccess(true)
            console.log(got);
        },
        onError: (error) => {
            console.log(error.data, error.message, error.shape);
        }
    });

    const onSubmit = (values: z.infer<typeof FormSchema>) => {
        sendInvitation.mutate({ ...values, sendEmail })
    };

    const { data: settingsToken } = api.settings.getSettingsGroups.useQuery({
        group: 'token',
    });

    const tokenValidInH = settingsToken?.invitationValiditySec as number / 3600

    const submitButtonLabel = translate(dictionary, sendEmail
        ? showSendSuccess
            ? "invite:form-success-send-invitation"
            : "invite:form-submit-send-invitation"
        : "invite:form-submit-generate-invitation-link")

    const buttonIcon = showSendSuccess
        ? "fa-solid fa-check"
        : sendEmail
            ? "fa-solid fa-paper-plane"
            : "fa-sharp fa-solid fa-link-simple"

    const linkHeadline = translate(dictionary, sendEmail
        ? "invite:you-can-copy-link"
        : "invite:link-generated")


    const isFormValid = sendEmail
        ? form.getValues('role') && form.getValues('email')
        : form.getValues('role')

    return (
        <div className='p-6 pt-2 text-left'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} >
                    <div className='mb-6'>
                        <p>{translate(dictionary, 'invite:description')}</p>
                    </div>
                    <InputsWrapper className='mb-8'>
                        <div className='grid grid-cols-1 gap-y-4'>
                            <div className={`grid grid-cols-1 ${role ? "" : "md:grid-cols-2"} items-center gap-x-6 gap-y-4`}>
                                {role ? null : <div className='w-full md:w-full lg:w-auto lg:flex-shrink-0'>
                                    <FormField
                                        control={form.control}
                                        name='role'
                                        render={({ field }) => (
                                            <AuthInput
                                                message={translate(dictionary, form.formState.errors.role?.message)}
                                            >
                                                {roles ? <Dropdown
                                                    {...field}
                                                    placeholder={translate(dictionary, 'invite:form-role-label')}
                                                    options={roles}
                                                    value={form.getValues('role')}
                                                    styles={{
                                                        control:
                                                        {
                                                            width: '100%',
                                                        }
                                                    }}
                                                /> : <i className={`my-4 animate-spin fas fa-spinner`} />}
                                            </AuthInput>
                                        )}
                                    />
                                </div>}
                                <div className='w-full md:w-full lg:w-auto lg:flex-shrink-0'>
                                    <Checkbox
                                        checked={sendEmail}
                                        onChange={updateSendEmail}
                                        label={translate(dictionary, 'invite:sent-invitation-by-email')}
                                        id='sendEmail'
                                        className='w-full'
                                    />
                                </div>
                            </div>
                            <div className={`w-full md:col-span-2 lg:w-auto lg:flex-grow lg:min-w-64 
                                transition-all duration-300 overflow-hidden ${sendEmail
                                    ? 'max-h-40 opacity-100'
                                    : isMounted
                                        ? 'max-h-0 opacity-0'
                                        : 'max-h-0 opacity-0'}`}>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <AuthInput
                                            message={translate(dictionary, form.formState.errors.email?.message)}
                                        >
                                            <InputStandard
                                                placeholder={translate(dictionary, 'invite:form-email-placeholder')}
                                                type='email'
                                                {...field}
                                                id='email'
                                            />
                                        </AuthInput>
                                    )}
                                />
                            </div>
                            <MyButton
                                className='w-full'
                                type='submit'
                                onClick={form.handleSubmit(onSubmit)}
                                id='submit-invitation'
                                ariaLabel={submitButtonLabel}
                                loading={sendInvitation.isPending}
                                icon={buttonIcon}
                                disabled={!isFormValid}
                            >
                                {submitButtonLabel}
                            </MyButton>
                        </div>
                    </InputsWrapper>
                </form>
            </Form>
            <p className='text-sm dark:text-neutral-400'
            >{translate(dictionary, 'invite:disclaimer', [tokenValidInH])}</p>
            <Message
                show={!!sendInvitation.error?.message}
                status='error'
                message={sendInvitation?.error?.message}
                className='my-6'
            />
            <div className={`mt-4
            transition-all duration-300 overflow-hidden ${sendInvitation.data
                    ? 'max-h-[150px] animate-fadeIn'
                    : 'max-h-0 animate-fadeOut'}
            `}>
                {sendInvitation.data && <LinkCopy
                    label={linkHeadline}
                    link={sendInvitation.data?.url}
                />}
            </div>
        </div>
    );
};

export default Invite;