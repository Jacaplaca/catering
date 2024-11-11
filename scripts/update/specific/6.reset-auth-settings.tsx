import { resetSettingsToDefault } from '@root/app/server/cache/settings';

const resetAuthSettings = async () => {
    console.log("6 >>> resetAuthSettings...");
    await resetSettingsToDefault(['auth']);
    return;
}

export default resetAuthSettings;