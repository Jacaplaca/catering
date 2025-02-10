import { type RoleType } from '@prisma/client';
import getCurrentTime from '@root/app/lib/date/getCurrentTime';
import { removeExpiredInviteTokens } from '@root/app/lib/removeExpiredTokens';
import makeHref from '@root/app/lib/url/makeHref';
import staticEmailContext from '@root/app/server/api/routers/specific/libs/staticEmailContext';
import { protectedProcedure } from '@root/app/server/api/trpc';
import { getSetting } from '@root/app/server/cache/settings';
import { throwTranslation } from '@root/app/server/cache/translations';
import sendInviteRequest from '@root/app/server/email/invite';
import tokenGenerator from '@root/app/server/email/libs/tokenGenerator';
import getRolesToInvite from '@root/app/server/lib/roles/getRolesToInvite';
import { sendInviteValidator } from '@root/app/validators/token';

const sendInvite = protectedProcedure
    .input(sendInviteValidator)
    .mutation(async ({ ctx, input }) => {
        const { db, session } = ctx;
        const { role: roleNameForInvite, email, lang, sendEmail } = input;
        const { user } = session;
        const { roleId, id: inviterId } = user;
        const rolesAvailableToInviteForUser = await getRolesToInvite(roleId);
        const roleToInvite = rolesAvailableToInviteForUser.find(x => x.id === roleNameForInvite);

        const invitedEmail = sendEmail ? email : null;

        if (!roleToInvite) {
            await throwTranslation(lang, 'invite:form-error-role-invalid');
        }
        await removeExpiredInviteTokens();
        const currentInvitation = await db.inviteToken.findFirst({
            where: {
                email: invitedEmail,
                inviterId,
            }
        });
        if (currentInvitation && sendEmail) {
            const { expires } = currentInvitation;
            const now = getCurrentTime();
            const hours = Math.abs(expires.getTime() - now.getTime()) / 36e5;
            await throwTranslation(lang, 'invite:form-error-user-invited', [email, hours.toFixed(0)]);
        }

        const tokenValidity = await getSetting<number>('token', 'invitationValiditySec');
        const { token, expires } = tokenGenerator(tokenValidity);

        await db.inviteToken.create({
            data: {
                token,
                email: invitedEmail,
                inviterId,
                expires,
                roleId: roleNameForInvite as RoleType,
            }
        });

        const url = makeHref({
            lang,
            page: 'invitation',
            slugs: [token]
        }, true)

        void (sendEmail && sendInviteRequest({
            invitedEmail: email,
            url,
            lang,
            inviterEmail: user.email,
            expires,
            staticContext: await staticEmailContext(inviterId),
        }))

        return {
            url
        };

    })

export default sendInvite;