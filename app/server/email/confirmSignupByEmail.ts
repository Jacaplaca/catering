import makeHref from '@root/app/lib/url/makeHref'
import sendMail from '@root/app/server/email/libs/sendEmail'

async function sendConfirmationSignupByEmailRequest({ to, lang, token, expires }: {
  to: string
  token: string
  lang: LocaleApp
  expires: Date
}) {

  const url = makeHref({
    lang,
    page: 'activate',
    slugs: [token]
  }, true)

  const dynamicContext = {
    url,
    expires: expires.toLocaleString(lang),
  }

  await sendMail({
    to,
    templateName: "confirmSignupByEmail",
    dynamicContext,
    lang,
  })
}


export default sendConfirmationSignupByEmailRequest