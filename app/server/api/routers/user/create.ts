import getCurrentTime from '@root/app/lib/date/getCurrentTime';
import getInviteToken from '@root/app/lib/getInviteToken';
import { removeExpiredConfirmationSignupByEmailTokens } from '@root/app/lib/removeExpiredTokens';
import isUserWithEmailAndPassExists from '@root/app/server/api/routers/user/libs/isUserWithEmailAndPassExists';
import removeUserIfNotVerifiedAndNotAccount from '@root/app/server/api/routers/user/libs/removeUserIfNotVerifiedAndNotAccount';
import validatePasswordCustomApi from '@root/app/server/api/routers/user/libs/validatePasswordCustomApi';
import { publicProcedure } from '@root/app/server/api/trpc';
import { getSetting } from '@root/app/server/cache/settings';
import { getTranslation } from '@root/app/server/cache/translations';
import sendConfirmationSignupByEmailRequest from '@root/app/server/email/confirmSignupByEmail';
import tokenGenerator from '@root/app/server/email/libs/tokenGenerator';
import allowSignup from '@root/app/server/lib/allowSignup';
import autoAssignRoleToUser from '@root/app/server/lib/roles/autoAssignRoleToUser';
import { userCreateValidator } from '@root/app/validators/user';
import { hash } from 'bcryptjs';

const create = publicProcedure
    .input(userCreateValidator)
    .mutation(async ({ ctx, input }) => {
        const { db } = ctx
        const { email, password, lang, inviteToken } = input;

        const inviteTokenDetails = inviteToken ? await getInviteToken(inviteToken) : null;

        const openRegistration = await getSetting<boolean>('main', 'openRegistration');
        if (!openRegistration && !inviteTokenDetails) {
            const errorMessage = await getTranslation(lang, 'sign-up:registration_closed');
            throw new Error(errorMessage);
        }

        await allowSignup(db, lang)

        await removeUserIfNotVerifiedAndNotAccount(email)
        await validatePasswordCustomApi(password, lang)
        await removeExpiredConfirmationSignupByEmailTokens()

        await isUserWithEmailAndPassExists({ email, lang })

        const passwordSalt = await getSetting<number>('password', "salt");
        const passwordHash = await hash(password, passwordSalt);

        const hasSuperAdmin = await db.user.findFirst({
            where: {
                roleId: "superAdmin",
            },
        });

        const user = await db.user.findUnique({
            where: {
                email: email.toLowerCase().trim(),
            },
        });

        const isNewUser = !user;

        const currentUser = isNewUser
            ? await db.user.create({
                data: {
                    email: email.toLowerCase().trim(),
                    passwordHash,
                    emailVerified: hasSuperAdmin ? null : getCurrentTime(),
                    roleId: hasSuperAdmin ? null : 'superAdmin',
                    name: null,
                    image: null,
                },
            })
            : await db.user.update({
                where: {
                    id: user?.id,
                },
                data: {
                    passwordHash,
                },
            });

        const tokenValidity = await getSetting<number>('token', "confirmSignupByEmailValiditySec");
        const { token, expires } = tokenGenerator(tokenValidity);

        await db.activationToken.deleteMany({
            where: {
                identifier: currentUser.email,
            },
        });

        hasSuperAdmin && await db.activationToken.create({
            data: {
                token,
                expires,
                identifier: currentUser.email,
            },
        })

        hasSuperAdmin && await sendConfirmationSignupByEmailRequest({
            to: currentUser.email,
            token,
            lang,
            expires,
        });

        inviteToken && await autoAssignRoleToUser({ userId: currentUser.id, inviteToken })

        if (!hasSuperAdmin) {
            await db.superAdmin.create({
                data: {
                    userId: currentUser.id,
                },
            });
        }

        return {
            name: currentUser.name,
            email: currentUser.email,
            newUser: isNewUser,
            isFirstSuperAdmin: Boolean(!hasSuperAdmin && isNewUser && currentUser.roleId === 'superAdmin'),
        };
    })

export default create;