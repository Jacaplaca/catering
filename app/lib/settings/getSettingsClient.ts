import { api } from '@root/app/trpc/react';

const getSettingsClient = (group: string) => {
    return api.settings.getSettingsGroups.useQuery({ group });
};

export default getSettingsClient;