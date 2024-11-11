import makeHref from '@root/app/lib/url/makeHref'
import sendMail from '@root/app/server/email/libs/sendEmail'

async function sendConfirmationSignupByEmailRequest({ to, lang, token }: {
  to: string
  token: string
  lang: LocaleApp
}) {

  const url = makeHref({
    lang,
    page: 'activate',
    slugs: [token]
  }, true)

  const dynamicContext = {
    url,
  }

  await sendMail({
    to,
    templateName: "confirmSignupByEmail",
    dynamicContext,
    lang,
  })
}


export default sendConfirmationSignupByEmailRequest