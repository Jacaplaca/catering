import { api } from '@root/app/trpc/react';

export const useCheckSettings = () => {
    const { data: hasFinishedSettings, refetch: checkFinishedSettingsRefetch } = api.privateSettings.hasFinished.useQuery();
    return { hasFinishedSettings, checkFinishedSettingsRefetch };
};