import { zodResolver } from '@hookform/resolvers/zod';
import superAdminEmailInputsDefs from '@root/app/_components/Dashboard/SuperAdmin/emailInputsDefs';
import { useCheckSettings } from '@root/app/hooks/calls';
import getInputsBulk from '@root/app/lib/table/getInputsBulk';
import { api } from '@root/app/trpc/react';
import { updateEmailSettingsValid } from '@root/app/validators/settings';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

const FormSchema = updateEmailSettingsValid;
const useEmailSettings = ({ dictionary }: {
    dictionary: Record<string, string>;
}) => {
    const utils = api.useUtils();
    const { data: settings, refetch: settingsRefetch, isFetching } = api.settings.getSuperAdminSettings.useQuery();
    const { hasFinishedSettings, checkFinishedSettingsRefetch } = useCheckSettings();

    const { data: isAppActive } = api.settings.getIsAppActive.useQuery();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            contactAdmin: '',
            from: '',
            fromAlias: '',
            fromActivation: '',
            host: '',
            password: '',
            port: 0,
            templateHtmlWrapper: '',
            username: '',
            invitationValiditySec: 0,
            confirmSignupByEmailValiditySec: 0,
            // resetPasswordValiditySec: 0,
            // confirmNewEmailValiditySec: 0,
        },
    });

    useEffect(() => {
        if (settings) {
            const { email, token } = settings;
            form.reset({
                contactAdmin: email.contactAdmin ?? '',
                from: email.from ?? '',
                fromAlias: email.fromAlias ?? '',
                fromActivation: email.fromActivation ?? '',
                host: email.host ?? '',
                password: email.password ?? '',
                port: email.port ?? 0,
                templateHtmlWrapper: email.templateHtmlWrapper ?? '',
                username: email.username ?? '',
                invitationValiditySec: token.invitationValiditySec ? token.invitationValiditySec / 3600 : 0,
                confirmSignupByEmailValiditySec: token.confirmSignupByEmailValiditySec ? token.confirmSignupByEmailValiditySec / 3600 : 0,
                // resetPasswordValiditySec: token.resetPasswordValiditySec ? token.resetPasswordValiditySec / 3600 : 0,
                // confirmNewEmailValiditySec: token.confirmNewEmailValiditySec ? token.confirmNewEmailValiditySec / 3600 : 0,
            });
        }
    }, [settings, form]);

    const submitFunction = api.settings.update;

    const updateSetting = submitFunction.useMutation({
        onSuccess: async () => {
            await settingsRefetch();
            hasFinishedSettings ? null : await checkFinishedSettingsRefetch();
        },
        onError: (error) => {
            console.log(error.data, error.message, error.shape);
        }
    });

    const onSubmit = (values: z.infer<typeof FormSchema>) => {
        console.log(values);
        updateSetting.mutate(values);
    };

    const testEmail = api.settings.testEmail.useMutation({
        onSuccess: () => {
            console.log('email sent');
        }
    });

    const onTestEmail = (values: z.infer<typeof FormSchema>) => {
        testEmail.mutate(values);
    };

    const Inputs = getInputsBulk<keyof z.infer<typeof FormSchema>>({
        inputs: superAdminEmailInputsDefs(form),
        dictionary,
        formControl: form.control,
        isFetching: isFetching || updateSetting.isPending
    });

    const activateApp = api.settings.activateApp.useMutation({
        onSuccess: () => {
            console.log('app activated');
        },
        onSettled: async () => {
            await utils.settings.getIsAppActive.invalidate();
        }
    });

    const onActivateApp = () => {
        activateApp.mutate();
    };

    const deactivateApp = api.settings.deactivateApp.useMutation({
        onSuccess: () => {
            console.log('app deactivated');
        },
        onSettled: async () => {
            await utils.settings.getIsAppActive.invalidate();
        }
    });

    const onDeactivateApp = () => {
        deactivateApp.mutate();
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        hasFinishedSettings,
        Inputs,
        onTestEmail: form.handleSubmit(onTestEmail),
        isAppActive,
        onActivateApp,
        onDeactivateApp,
    };
};

export default useEmailSettings;