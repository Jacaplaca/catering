import { RoleType } from '@prisma/client';
import getJobId from '@root/app/server/api/routers/specific/libs/getJobId';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { getSetting } from '@root/app/server/cache/settings';
import { s3deleteKeys } from '@root/app/server/s3/delete';
import dateToWeek from '@root/app/specific/lib/dateToWeek';
import { saveClientsFiles } from '@root/app/validators/specific/clientFiles';

// type ClientSettings {
//     // lastOrderTime String?
//     name String?
// }

// type ClientInfo {
//     name String?
//     email String?
//     phone String?
//     address String?
//     city String?
//     zip String?
//     contactPerson String?
//     notes String?
//     country String?
//     code String?
// }

// model Client {
//     id String @id @default(cuid()) @map("_id")
//     userId String @unique
//     user User @relation(fields: [userId], references: [id])
//     cateringId String
//     catering Catering @relation(fields: [cateringId], references: [id])
//     settings ClientSettings //editable by catering
//     info ClientInfo //editable by catering
//     name String? //editable by client
//     consumers Consumer[]
//     orders Order[]
//     tags TagClient[]
//     files ClientFile[]
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
// }

// enum ClientFileType {
//     menu
//     checklist
//     diets
// }

// type ClientFileWeek {
//     year Int
//     week Int
// }

// model ClientFile {
//     id String @id @default(cuid()) @map("_id")
//     clientId String
//     client Client @relation(fields: [clientId], references: [id])
//     dieticianId String
//     dietician Dietician @relation(fields: [dieticianId], references: [id])
//     cateringId String
//     catering Catering @relation(fields: [cateringId], references: [id])
//     fileType ClientFileType
//     s3Key String
//     week ClientFileWeek

//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
// }

const save = createCateringProcedure('dietician')
    .input(saveClientsFiles)
    .mutation(async ({ ctx, input }) => {
        const { db, session } = ctx
        const { day, s3ObjectKeys, fileType, clientIds, fileName } = input;
        const { cateringId } = session.user;

        const dieticianId = await getJobId({ userId: session.user.id, cateringId, roleId: RoleType.dietician });

        if (!cateringId) {
            throw new Error("Brak ID cateringu");
        }

        if (!dieticianId) {
            throw new Error("Brak ID dietetyka");
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
                        dieticianId,
                        cateringId,
                        fileType,
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
                        dieticianId,
                        cateringId,
                        fileType,
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
        };
    });

export default save;
