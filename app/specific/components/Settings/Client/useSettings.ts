import { zodResolver } from '@hookform/resolvers/zod';
import { useCheckSettings } from '@root/app/hooks/calls';
import getInputsBulk from '@root/app/lib/table/getInputsBulk';
import clientSettingsInputsDefs from '@root/app/specific/components/Settings/Client/inputsDefs';
import { api } from '@root/app/trpc/react';
import { clientSettingsValidator } from '@root/app/validators/specific/settings';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

const FormSchema = clientSettingsValidator;
const useClientSettings = ({ dictionary, clientId }: {
    dictionary: Record<string, string>;
    clientId?: string;
}) => {
    const { data: settings, refetch: settingsRefetch, isFetching } = api.specific.settings.getForClient.useQuery({ clientId });
    const { hasFinishedSettings, checkFinishedSettingsRefetch } = useCheckSettings();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            // lastOrderTime: '--:--',
        }
    });

    useEffect(() => {
        if (settings) {
            form.reset({
                name: settings.name ?? '',
                // lastOrderTime: settings.lastOrderTime ?? '--:--',
            });
        }
    }, [settings, form]);

    const submitFunction = api.specific.settings.updateByClient;

    const updateSetting = submitFunction.useMutation({
        onSuccess: async () => {
            await settingsRefetch();
            window.location.reload();
            hasFinishedSettings ? null : await checkFinishedSettingsRefetch();
        },
        onError: (error) => {
            console.log(error.data, error.message, error.shape);
        }
    });

    const onSubmit = (values: z.infer<typeof FormSchema>) => {
        updateSetting.mutate({ ...values, clientId });
    };

    const Inputs = getInputsBulk<keyof z.infer<typeof FormSchema>>({
        inputs: clientSettingsInputsDefs(form),
        dictionary,
        formControl: form.control,
        isFetching: isFetching || updateSetting.isPending
    });

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        hasFinishedSettings,
        Inputs,
    };
};

export default useClientSettings;