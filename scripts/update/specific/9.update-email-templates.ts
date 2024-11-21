import { resetEmailTemplates } from '@root/scripts/lib/resetEmailTemplates';

const updateEmailTemplates = async () => {
    console.log("9 >>> reset email templates...");
    await resetEmailTemplates({ templateName: 'confirmSignupByEmail' });
    await resetEmailTemplates({ templateName: 'invite' });
    return;
}

export default updateEmailTemplates;