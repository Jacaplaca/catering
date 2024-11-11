import makeHref from '@root/app/lib/url/makeHref'
import sendMail from '@root/app/server/email/libs/sendEmail'

async function sendChangeEmailRequest({ to, lang, token }: {
  to: string
  token: string
  lang: LocaleApp
}) {

  const url = makeHref({
    lang,
    page: 'change-email',
    slugs: [token]
  }, true)

  const dynamicContext = {
    url,
  }

  await sendMail({
    to,
    templateName: "confirmNewEmail",
    dynamicContext,
    lang,
  })
}


export default sendChangeEmailRequest