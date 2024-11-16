import { RoleType } from '@prisma/client';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { getSetting } from '@root/app/server/cache/settings';
import { s3deleteKeys } from '@root/app/server/s3/delete';
import dateToWeek from '@root/app/specific/lib/dateToWeek';
import { saveClientsFiles } from '@root/app/validators/specific/clientFiles';

const save = createCateringProcedure([RoleType.dietician, RoleType.manager])
    .input(saveClientsFiles)
    .mutation(async ({ ctx, input }) => {
        const { db, session } = ctx
        const { day, s3ObjectKeys, fileType, clientIds, fileName } = input;
        const { cateringId } = session.user;

        if (!cateringId) {
            throw new Error("Brak ID cateringu");
        }

        const { week, weekYear } = dateToWeek(day);
        const clientFilePrefix = await getSetting<string>('client-files', 's3-prefix');

        const clientFiles = [];

        for (const clientId of clientIds) {
            for (const s3Key of s3ObjectKeys) {
                const key = `${clientFilePrefix}/${s3Key}`;
                const existingFile = await db.clientFile.findFirst({
                    where: {
                        clientId,
                        cateringId,
                        fileType,
                        editedById: session.user.id,
                        week: {
                            is: {
                                year: weekYear,
                                week,
                            },
                        },
                    },
                });

                if (existingFile) {
                    await db.clientFile.update({
                        where: { id: existingFile.id },
                        data: { s3Key: key },
                    });
                    const isKeyUsed = await db.clientFile.findFirst({
                        where: { s3Key: existingFile.s3Key },
                    });
                    if (!isKeyUsed) {
                        await s3deleteKeys([existingFile.s3Key]);
                    }
                } else {
                    clientFiles.push({
                        clientId,
                        cateringId,
                        fileType,
                        editedById: session.user.id,
                        s3Key: key,
                        fileName,
                        week: {
                            year: weekYear,
                            week,
                        },
                    });
                }
            }
        }

        let createdCount = 0;
        if (clientFiles.length > 0) {
            const result = await db.clientFile.createMany({
                data: clientFiles,
            });
            createdCount = result.count;
        }

        return {
            success: true,
            count: createdCount,
            affectedClientIds: clientIds,
            fileType,
        };
    });

export default save;
