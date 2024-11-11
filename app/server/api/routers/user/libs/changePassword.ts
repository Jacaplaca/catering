import { getSetting } from '@root/app/server/cache/settings';
import { db } from '@root/app/server/db';
import { hash } from 'bcryptjs';

const changePassword = async ({ userId, password }: {
    userId: string, password: string
}) => {
    const passwordSalt = await getSetting<number>('password', "salt");
    const passwordHash = await hash(password, passwordSalt);
    const user = await db.user.findUnique({
        where: {
            id: userId,
        },
    });
    const data: {
        passwordHash: string,
        emailVerified?: Date
    } = {
        passwordHash,
    }
    if (!user?.emailVerified) {
        data.emailVerified = new Date()
    }

    await db.user.update({
        where: {
            id: userId,
        },
        data,
    });
};

export default changePassword;