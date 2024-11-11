import { env } from '@root/app/env';
import sendMail from '@root/app/server/email/libs/sendEmail'

async function sendContactRequest({ message, senderEmail, lang }: {
    message: string
    senderEmail: string
    lang: LocaleApp
}) {

    const dynamicContext = {
        message,
        senderEmail
    }

    await sendMail({
        to: env.EMAIL_CONTACT_ADMIN,
        templateName: "contactRequest",
        dynamicContext,
        lang,
    })
}

export default sendContactRequest