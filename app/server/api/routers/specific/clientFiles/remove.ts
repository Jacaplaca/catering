import { RoleType, type ClientFileType } from '@prisma/client';
import getJobId from '@root/app/server/api/routers/specific/libs/getJobId';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { s3deleteKeys } from '@root/app/server/s3/delete';
import dateToWeek from '@root/app/specific/lib/dateToWeek';
import { removeClientFilesByIds, removeClientFilesByTypeAndClientIdsValid } from '@root/app/validators/specific/clientFiles';
import { sleep } from 'openai/core';

export const byId = createCateringProcedure('dietician')
    .input(removeClientFilesByIds)
    .mutation(async ({ ctx, input }) => {
        const { db, session } = ctx
        const { ids } = input;
        const { cateringId } = session.user;

        const dieticianId = await getJobId({ userId: session.user.id, cateringId, roleId: RoleType.dietician });

        if (!cateringId) {
            throw new Error("Brak ID cateringu");
        }

        if (!dieticianId) {
            throw new Error("Brak ID dietetyka");
        }

        const uniqueClientIds = new Set<string>();

        for (const fileId of ids) {
            const existingFile = await db.clientFile.findFirst({
                where: {
                    id: fileId
                }
            });

            if (!existingFile) {
                console.log(`File not found: ${fileId}`);
                continue;
            }

            uniqueClientIds.add(existingFile.clientId);

            await db.clientFile.delete({
                where: {
                    id: fileId
                }
            });

            const isKeyUsed = await db.clientFile.findFirst({
                where: { s3Key: existingFile.s3Key },
            });
            if (!isKeyUsed) {
                await s3deleteKeys([existingFile.s3Key]);
            }
        }

        return {
            success: true,
            affectedClientIds: Array.from(uniqueClientIds),
        };
    });

export const byTypeAndClientIds = createCateringProcedure('dietician')
    .input(removeClientFilesByTypeAndClientIdsValid)
    .mutation(async ({ ctx, input }) => {
        await sleep(1000);
        const { db, session } = ctx
        const { cateringId } = session.user;

        if (!cateringId) {
            throw new Error("Brak ID cateringu");
        }

        const dieticianId = await getJobId({ userId: session.user.id, cateringId, roleId: RoleType.dietician });

        if (!dieticianId) {
            throw new Error("Brak ID dietetyka");
        }

        const { fileType, clientIds, day } = input;
        const { week, weekYear } = dateToWeek(day);

        type BaseWhereObject = {
            cateringId: string;
            week: {
                is: {
                    year: number;
                    week: number;
                }
            },
        };

        type WhereObject = BaseWhereObject & {
            fileType?: ClientFileType;
            clientId?: { in: string[] };
        };

        const where: WhereObject = {
            cateringId,
            week: {
                is: {
                    year: weekYear,
                    week,
                }
            },
        };

        if (fileType) {
            where.fileType = fileType;
        }

        if (clientIds && clientIds.length > 0) {
            where.clientId = {
                in: clientIds
            }
        }

        const files = await db.clientFile.findMany({
            where,
        });

        const uniqueS3Keys = new Set<string>();

        for (const file of files) {
            uniqueS3Keys.add(file.s3Key);
        }

        await db.clientFile.deleteMany({
            where,
        });

        const unusedS3Keys: string[] = [];
        for (const s3Key of uniqueS3Keys) {
            const isKeyUsed = await db.clientFile.findFirst({
                where: { s3Key },
            });
            if (!isKeyUsed) {
                unusedS3Keys.push(s3Key);
            }
        }

        if (unusedS3Keys.length > 0) {
            await s3deleteKeys(unusedS3Keys);
        }

        return { files, uniqueS3Keys: Array.from(uniqueS3Keys), deletedS3Keys: unusedS3Keys };

    })

const objToExport = {
    byId,
    byTypeAndClientIds
}

export default objToExport;
