import makeHref from '@root/app/lib/url/makeHref'
import sendMail from '@root/app/server/email/libs/sendEmail'

async function sendResetPasswordRequest({ to, token, lang }: {
  to: string
  token: string
  lang: LocaleApp
}) {

  const url = makeHref({
    lang,
    page: 'reset-password',
    slugs: [token]
  }, true)

  const dynamicContext = {
    url,
  }

  await sendMail({
    to,
    templateName: "resetPassword",
    dynamicContext,
    lang,
  })
}

export default sendResetPasswordRequest