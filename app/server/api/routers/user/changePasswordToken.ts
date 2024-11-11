import { removeExpiredPasswordTokens } from '@root/app/lib/removeExpiredTokens';
import changePassword from '@root/app/server/api/routers/user/libs/changePassword';
import validatePasswordCustomApi from '@root/app/server/api/routers/user/libs/validatePasswordCustomApi';
import { publicProcedure } from '@root/app/server/api/trpc';
import { getTranslation, throwTranslation } from '@root/app/server/cache/translations';
import { createNewPasswordValidator } from '@root/app/validators/user';

const throwTokenError = async (lang: LocaleApp) => {
    return await throwTranslation(lang, 'change-password:invalid_token');
}

const changePasswordToken = publicProcedure
    .input(createNewPasswordValidator)
    .mutation(async ({ ctx, input }) => {
        const { token, password, lang } = input;

        if (!token) {
            return await throwTokenError(lang)
        }

        const tokenExists = await ctx.db.resetPasswordToken.findUnique({
            where: {
                token: token.toLowerCase().trim(),
                expires: {
                    gt: new Date()
                }
            },
        });

        if (!tokenExists) {
            return await throwTokenError(lang)
        }

        const user = await ctx.db.user.findUnique({
            where: {
                email: tokenExists.identifier,
            },
        });

        if (!user) {
            return await throwTokenError(lang)
        }

        await validatePasswordCustomApi(password, lang)

        await changePassword({ userId: user.id, password });

        await ctx.db.resetPasswordToken.deleteMany({
            where: {
                identifier: user.email,
            },
        });
        await removeExpiredPasswordTokens();

        const successMessage = await getTranslation(lang, 'change-password:change_password_success');

        return successMessage
    });

export default changePasswordToken;