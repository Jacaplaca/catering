import { resetToDefault } from '@root/app/server/cache/settings';


const updateEmailTemplates = async () => {
    console.log("10 >>> update logo...");
    await resetToDefault('main', 'logoDark');
    await resetToDefault('main', 'logoLight');
    return;
}

export default updateEmailTemplates;