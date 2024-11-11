import { db } from '@root/app/server/db';

const removeUserIfNotVerifiedAndNotAccount = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email: email.toLowerCase().trim(),
        },
    });
    const { id, emailVerified } = user ?? {}
    if (id) {
        const account = await db.account.findFirst({
            where: {
                userId: id
            }
        })
        if (!account && !emailVerified) {
            await db.user.delete({
                where: {
                    id
                }
            })
        }
    }
}

export default removeUserIfNotVerifiedAndNotAccount;