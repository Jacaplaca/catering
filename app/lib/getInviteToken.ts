import getCurrentTime from '@root/app/lib/date/getCurrentTime';
import { db } from '@root/app/server/db';

const getInviteToken = async (token: string) => await db.inviteToken.findUnique({
    where: {
        token: token.toLowerCase().trim(),
        expires: {
            gt: getCurrentTime()
        }
    },
    include: {
        inviter: true,
    }
});

export default getInviteToken;
