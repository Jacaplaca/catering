import { protectedProcedure } from '@root/app/server/api/trpc';
import { getTranslation } from '@root/app/server/cache/translations';
import { web3AddressValidator } from '@root/app/validators/user';
import { verifyMessage } from 'ethers';

const changeWeb3Address = protectedProcedure
    .input(web3AddressValidator)
    .mutation(async ({ ctx, input }) => {
        const { signedMessage, lang } = input;

        const signingMessage = await getTranslation(lang, 'web3:signing_message');

        const web3AddressDecoded = verifyMessage(signingMessage, signedMessage);
        const web3Address = web3AddressDecoded.trim().toLowerCase()

        await ctx.db.user.updateMany({
            where: {
                web3Address
            },
            data: {
                web3Address: null,
            },
        });

        await ctx.db.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                web3Address,
            },
        });

        return web3Address;
    });

export default changeWeb3Address;