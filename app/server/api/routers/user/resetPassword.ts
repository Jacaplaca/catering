import { removeExpiredPasswordTokens } from '@root/app/lib/removeExpiredTokens';
import { publicProcedure } from '@root/app/server/api/trpc';
import { getSetting } from '@root/app/server/cache/settings';
import tokenGenerator from '@root/app/server/email/libs/tokenGenerator';
import sendResetPasswordRequest from '@root/app/server/email/resetPasswordRequest';
import { resetPasswordValidator } from '@root/app/validators/user';
import { NextResponse } from 'next/server';

const resetPassword = publicProcedure
    .input(resetPasswordValidator)
    .mutation(async ({ ctx, input }) => {

        const tokenValidity = await getSetting<number>('token', "resetPasswordValiditySec");


        NextResponse.json({
            send: true,
        });

        const { email, lang } = input;
        const user = await ctx.db.user.findUnique({
            where: {
                email: email.toLowerCase().trim(),
            },
        });

        if (!user) {
            return NextResponse.json({
                send: true,
            });
        }

        const { token, expires } = tokenGenerator(tokenValidity);

        await ctx.db.resetPasswordToken.deleteMany({
            where: {
                identifier: user.email,
            },
        });

        await removeExpiredPasswordTokens()

        await ctx.db.resetPasswordToken.create({
            data: {
                token,
                expires,
                identifier: user.email,
            },
        })

        await sendResetPasswordRequest({
            to: user.email,
            token,
            lang
        });

    });

export default resetPassword;