import { resetSettingsToDefault } from '@root/app/server/cache/settings';

const resetTokenSettings = async () => {
    console.log("8 >>> resetTokenSettings...");
    await resetSettingsToDefault(['token']);
    return;
}

export default resetTokenSettings;