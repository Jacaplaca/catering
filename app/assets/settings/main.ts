import { env } from '@root/app/env';

const isDev = env.NODE_ENV === 'development';

const settingsDefault = {
  "PUBLIC:auth:password-min-length:NUMBER": isDev ? 3 : 8,
  // "PUBLIC:auth:password-max-length:NUMBER": 50,
  "PUBLIC:auth:password-require-number:BOOLEAN": isDev ? false : true,
  "PUBLIC:auth:password-require-special:BOOLEAN": false,
  "PUBLIC:auth:password-require-uppercase:BOOLEAN": isDev ? false : true,
  "PUBLIC:auth:password-require-lowercase:BOOLEAN": isDev ? false : true,
  "PUBLIC:serpSim:backupSlots:NUMBER": 10,
  "PUBLIC:contact:maxMessageLength:NUMBER": 1000,
  "PUBLIC:main:siteName:STRING": 'Application',
  "PUBLIC:main:logoDark:STRING": '/default/logo-with-text-dark-mode.svg',
  "PUBLIC:main:logoLight:STRING": '/default/logo.svg',
  "PUBLIC:main:openRegistration:BOOLEAN": true,
  "PUBLIC:app:active:BOOLEAN": isDev,
  "PUBLIC:app:dbVer:NUMBER": 1,
  "PUBLIC:web3:network-chainId:NUMBER": 1,
  "PUBLIC:web3:network-name:STRING": 'mainnet',
  "PUBLIC:web3:human-network-name:STRING": 'Ethereum Mainnet',
  "PUBLIC:s3-prefix:logo:STRING": 'logo',
  "PRIVATE:token:resetPasswordValiditySec:NUMBER": 60 * 60 * 24,
  "PRIVATE:token:confirmSignupByEmailValiditySec:NUMBER": 60 * 60 * 24,
  "PUBLIC:token:confirmNewEmailValiditySec:NUMBER": 60 * 60 * 24,
  "PUBLIC:token:invitationValiditySec:NUMBER": 60 * 60 * 24,
  "PRIVATE:admin:phone:STRING": "+33600000000",
  "PRIVATE:admin:email:STRING": "admin@example.com",
  "PRIVATE:password:salt:NUMBER": 12,
  "PUBLIC:email:fromAlias:STRING": 'Application',
  "PRIVATE:email:host:STRING": process.env.EMAIL_HOST,
  "PRIVATE:email:port:NUMBER": process.env.EMAIL_PORT,
  "PRIVATE:email:username:STRING": process.env.EMAIL_USERNAME,
  "PRIVATE:email:password:STRING": process.env.EMAIL_PASSWORD,
  "PRIVATE:email:from:STRING": process.env.EMAIL_FROM,
  "PRIVATE:email:fromActivation:STRING": process.env.EMAIL_FROM_ACTIVATION,
  "PRIVATE:email:contactAdmin:STRING": process.env.EMAIL_CONTACT_ADMIN,
  "PRIVATE:email:templateHtmlWrapper:STRING": `
  <!DOCTYPE html>
  <html lang="[language]">
  <head>
      <style>
          body {
          font-family: Open Sans, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          background-color: #fff;
              }
          h2 { color: #333 }
          p { font-size: 16px; }
      </style>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  </head>
  <body>
  <img src="[logoUrl]" alt="application logo" style="width: 200px; height: 100px;" />
  <div style="font-size: 12px; padding: 20px;">
    [content]
  </div>
    <div
      style="background: #f0f0f0; padding: 20px; margin-top: 20px; font-size: 10px; line-height: 1; text-align: center; color: #333;"
    >
      <p>[phoneLabel]: <strong>[contactPhone]</strong></p>
      <p>[emailLabel]: <strong>[contactEmail]</strong></p>
    </div>
  </body>
  </html>`,
}

export default settingsDefault;