import changePassword from '@root/app/server/api/routers/user/libs/changePassword';
import validatePasswordCustomApi from '@root/app/server/api/routers/user/libs/validatePasswordCustomApi';
import { protectedProcedure } from '@root/app/server/api/trpc';
import { getTranslation } from '@root/app/server/cache/translations';
import { createNewPasswordValidator } from '@root/app/validators/user';

const changePasswordSession = protectedProcedure
    .input(createNewPasswordValidator)
    .mutation(async ({ ctx, input }) => {
        const { password, lang } = input;
        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        await validatePasswordCustomApi(password, lang)

        await changePassword({ userId: user.id, password });

        const successMessage = await getTranslation(lang, 'change-password:change_password_success');

        return successMessage
    })

export default changePasswordSession;