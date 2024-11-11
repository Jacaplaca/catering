import getInviteToken from '@root/app/lib/getInviteToken';
import { removeExpiredInviteTokens } from '@root/app/lib/removeExpiredTokens';
import { publicProcedure } from '@root/app/server/api/trpc';
import { getTranslation } from '@root/app/server/cache/translations';
import { getInviteTokenDetailsValidator } from '@root/app/validators/token';

const getInviteTokenDetails = publicProcedure
    .input(getInviteTokenDetailsValidator)
    .query(async ({ input }) => {
        const { token, lang } = input;

        await removeExpiredInviteTokens()
        const tokenObject = await getInviteToken(token);
        if (tokenObject?.inviter) {
            const { roleId } = tokenObject;
            const roleTranslation = await getTranslation(lang, 'role:' + roleId);
            return await getTranslation(lang, 'invite:form-token-info', [tokenObject.inviter.email, roleTranslation])
        }
        return null;
    })

export default getInviteTokenDetails;