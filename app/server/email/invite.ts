import sendMail from '@root/app/server/email/libs/sendEmail';

const sendInviteRequest = async ({
    invitedEmail,
    inviterEmail,
    lang,
    url,
    staticContext
}: {
    invitedEmail: string,
    inviterEmail: string,
    lang: LocaleApp,
    url: string,
    staticContext: Record<string, string>
}) => {

    const dynamicContext = {
        url,
        inviterEmail
    }

    await sendMail({
        to: invitedEmail,
        templateName: "invite",
        dynamicContext,
        staticContext,
        lang,
    })

}

export default sendInviteRequest