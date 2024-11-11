import { removeExpiredChangeEmailTokens } from '@root/app/lib/removeExpiredTokens';
import isUserWithEmailAndPassExists from '@root/app/server/api/routers/user/libs/isUserWithEmailAndPassExists';
import removeUserIfNotVerifiedAndNotAccount from '@root/app/server/api/routers/user/libs/removeUserIfNotVerifiedAndNotAccount';
import { protectedProcedure } from '@root/app/server/api/trpc';
import { getSetting } from '@root/app/server/cache/settings';
import sendChangeEmailRequest from '@root/app/server/email/changeEmailRequest';
import tokenGenerator from '@root/app/server/email/libs/tokenGenerator';
import { changeEmailValidator } from '@root/app/validators/user';

const changeEmailRequest = protectedProcedure
    .input(changeEmailValidator)
    .mutation(async ({ ctx, input }) => {
        const { email, lang } = input;


        await removeUserIfNotVerifiedAndNotAccount(email)
        await isUserWithEmailAndPassExists({ email, lang })

        const tokenValidity = await getSetting<number>('token', "confirmNewEmailValiditySec");
        const { token, expires } = tokenGenerator(tokenValidity);

        await ctx.db.changeEmailToken.deleteMany({
            where: {
                userId: ctx.session.user.id,
            },
        });

        await removeExpiredChangeEmailTokens()

        await ctx.db.changeEmailToken.create({
            data: {
                token,
                expires,
                userId: ctx.session.user.id,
                newEmail: email.toLowerCase().trim(),
            },
        })

        await sendChangeEmailRequest({
            to: email,
            token,
            lang
        });

    });

export default changeEmailRequest;