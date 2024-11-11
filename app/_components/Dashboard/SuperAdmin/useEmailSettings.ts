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
        },
    });

    useEffect(() => {
        if (settings) {
            form.reset({
                contactAdmin: settings.contactAdmin ?? '',
                from: settings.from ?? '',
                fromAlias: settings.fromAlias ?? '',
                fromActivation: settings.fromActivation ?? '',
                host: settings.host ?? '',
                password: settings.password ?? '',
                port: settings.port ?? 0,
                templateHtmlWrapper: settings.templateHtmlWrapper ?? '',
                username: settings.username ?? '',
            });
        }
    }, [settings, form]);

    const submitFunction = api.settings.updateEmailSettings;

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