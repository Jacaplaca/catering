import getCurrentTime from '@root/app/lib/date/getCurrentTime';
import removeNotConfirmedUsers from '@root/app/server/api/routers/specific/libs/removeNotConfirmedUsers';
import { db } from '@root/app/server/db'

export const removeExpiredConfirmationSignupByEmailTokens = async () => {
    const activationTokens = await db.activationToken.findMany({
        where: {
            expires: {
                lt: getCurrentTime()
            }
        }
    });


    const emails = activationTokens.map(token => token.identifier);

    const users = await db.user.findMany({
        where: {
            email: {
                in: emails
            },
            emailVerified: null,
            passwordHash: {
                not: null
            }
        }
    });

    await removeNotConfirmedUsers(users);

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
                lt: getCurrentTime()
            }
        }
    })
}

export const removeExpiredPasswordTokens = async () => {
    await db.resetPasswordToken.deleteMany({
        where: {
            expires: {
                lt: getCurrentTime()
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
                        lt: getCurrentTime()
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
