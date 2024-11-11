import { db } from '@root/app/server/db'

export const removeExpiredConfirmationSignupByEmailTokens = async () => {
    const activationTokens = await db.activationToken.findMany({
        where: {
            expires: {
                lt: new Date()
            }
        }
    })

    const emails = activationTokens.map(token => token.identifier)
    await db.user.deleteMany({
        where: {
            email: {
                in: emails
            },
            emailVerified: null,
            passwordHash: {
                not: null
            }
        }
    })
    await db.activationToken.deleteMany({
        where: {
            identifier: {
                in: emails
            }
        }
    })
}

export const removeExpiredChangeEmailTokens = async () => {
    return await db.changeEmailToken.findMany({
        where: {
            expires: {
                lt: new Date()
            }
        }
    })
}

export const removeExpiredPasswordTokens = async () => {
    await db.resetPasswordToken.deleteMany({
        where: {
            expires: {
                lt: new Date()
            }
        }
    })
}

export const removeExpiredInviteTokens = async () => {
    await db.inviteToken.deleteMany({
        where: {
            OR: [
                {
                    expires: {
                        lt: new Date()
                    }
                },
                {
                    inviter: {
                        is: null
                    }
                }
            ]
        }
    });
}
