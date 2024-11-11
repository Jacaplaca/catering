import { api } from "app/trpc/server";

const getSettingsFromApi = async (group: string) => {
    const settings = await api.settings.getSettingsGroups({
        group,
    });
    return settings;
};

export default getSettingsFromApi;