import { type Prisma, type ClipboardKey } from '@prisma/client';
import { db } from '@root/app/server/db';

const updateClipboard = async ({ key, value, userId }: {
    userId: string;
    key: ClipboardKey;
    value: string | number | boolean | Prisma.JsonObject | Prisma.JsonArray;
}) => {
    const clip = await db.clipboard.findUnique({
        where: {
            userId_key: { key, userId }
        },
    });

    if (clip) {
        await db.clipboard.update({
            where: {
                userId_key: { key, userId }
            },
            data: { value },
        });
    } else {
        await db.clipboard.create({
            data: { key, value, userId },
        });
    }
    return { success: key };
}

export default updateClipboard;