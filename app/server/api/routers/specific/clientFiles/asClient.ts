import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { db } from '@root/app/server/db';
import getJobId from '@root/app/server/api/routers/specific/libs/getJobId';
import { RoleType } from '@prisma/client';
import getDaysOfWeeks from '@root/app/specific/lib/getDaysOfWeeks';
import dateToWeek from '@root/app/specific/lib/dateToWeek';

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
//     fileName String

//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
// }

const asClient = createCateringProcedure('client')
    .query(async ({ ctx }) => {
        const { session: { catering, user } } = ctx;

        const clientId = await getJobId({ userId: user.id, cateringId: catering.id, roleId: RoleType.client });

        if (!clientId) {
            throw new Error("Brak ID klienta");
        }

        const daysOfWeeks = getDaysOfWeeks('wednesday');

        const weeks = daysOfWeeks.map((day) => {
            return dateToWeek(day);
        })

        return db.clientFile.findMany({
            where: {
                clientId,
                cateringId: catering.id,
                week: {
                    is: {
                        OR: weeks.map(week => ({
                            year: week.weekYear,
                            week: week.week
                        }))
                    }
                }
            }
        });
    });

export default asClient;
