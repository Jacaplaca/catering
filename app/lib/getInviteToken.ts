import { db } from '@root/app/server/db';

const getInviteToken = async (token: string) => await db.inviteToken.findUnique({
    where: {
        token: token.toLowerCase().trim(),
        expires: {
            gt: new Date()
        }
    },
    include: {
        inviter: true,
    }
});

export default getInviteToken;
