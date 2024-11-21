import sendMail from '@root/app/server/email/libs/sendEmail';

const sendInviteRequest = async ({
    invitedEmail,
    inviterEmail,
    lang,
    url,
    expires,
    staticContext
}: {
    invitedEmail: string,
    inviterEmail: string,
    lang: LocaleApp,
    url: string,
    expires: Date,
    staticContext: Record<string, string>
}) => {

    const dynamicContext = {
        url,
        inviterEmail,
        expires: expires.toLocaleString(lang),
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