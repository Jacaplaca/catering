import { api } from "app/trpc/server";

const getPersonalization = async () => {
    try {
        return await api.personalization.get();
    } catch (error) {
        return null;
    }
};

export default getPersonalization;