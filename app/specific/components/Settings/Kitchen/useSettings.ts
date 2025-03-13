import { zodResolver } from '@hookform/resolvers/zod';
import { useCheckSettings } from '@root/app/hooks/calls';
import getInputsBulk from '@root/app/lib/table/getInputsBulk';
import kitchenSettingsInputsDefs from '@root/app/specific/components/Settings/Kitchen/inputsDefs';
import { api } from '@root/app/trpc/react';
import { kitchenSettingsValidator } from '@root/app/validators/specific/settings';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

const FormSchema = kitchenSettingsValidator;
const useKitchenSettings = ({ dictionary }: {
    dictionary: Record<string, string>;
}) => {
    const { data: settings, refetch: settingsRefetch, isFetching } = api.specific.settings.getForKitchen.useQuery();
    const { hasFinishedSettings, checkFinishedSettingsRefetch } = useCheckSettings();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
        }
    });

    useEffect(() => {
        if (settings) {
            form.reset({
                name: settings.name ?? '',
            });
        }
    }, [settings, form]);

    const submitFunction = api.specific.settings.updateByKitchen;

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
        updateSetting.mutate(values);
    };

    const Inputs = getInputsBulk<keyof z.infer<typeof FormSchema>>({
        inputs: kitchenSettingsInputsDefs(form),
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

export default useKitchenSettings;