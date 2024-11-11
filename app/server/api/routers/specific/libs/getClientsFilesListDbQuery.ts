import { type Prisma, type Catering } from '@prisma/client';
import dateToWeek from '@root/app/specific/lib/dateToWeek';

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

const getClientsFilesListDbQuery = ({
    day,
    searchValue,
    catering,
    id,
    count = false
}: {
    searchValue?: string,
    catering: Catering,
    id?: string,
    day?: Date,
    count?: boolean
}) => {

    const { week, weekYear: year } = day instanceof Date ? dateToWeek(day) : { week: undefined, weekYear: undefined };

    type MatchObject = {
        cateringId?: string;
        id?: string;
        $or?: Record<string, {
            $regex?: string;
            $options?: string;
        }>[];
    };

    const query: MatchObject = {
        cateringId: catering.id
    }

    if (searchValue) {
        query.$or = [{
            name: { $regex: searchValue, $options: 'i' },
            // 'info.code': { $regex: searchValue, $options: 'i' }
        }];
    }

    if (id) {
        query.id = id;
    }

    const pipeline = [
        {
            $addFields: {
                id: '$_id'
            }
        },
        {
            $addFields: {
                code: '$info.code',
                name: '$info.name'
            }
        },
        {
            $project: {
                _id: 0,
                id: 1,
                cateringId: 1,
                info: 1,
                name: 1,
                code: 1,
                createdAt: 1,
            }
        },
        {
            $match: query
        }
    ] as Prisma.InputJsonValue[];

    if (!count) {
        pipeline.push(
            {
                $lookup: {
                    from: 'ClientFile',
                    let: { clientId: '$id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$clientId', '$$clientId'] },
                                        ...(week !== undefined && year !== undefined ? [
                                            { $eq: ['$week.week', week] },
                                            { $eq: ['$week.year', year] }
                                        ] : [])
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                s3Key: 1,
                                fileType: 1
                            }
                        }
                    ],
                    as: 'clientFiles'
                }
            },
            {
                $addFields: {
                    menu: {
                        $filter: {
                            input: '$clientFiles',
                            as: 'file',
                            cond: { $eq: ['$$file.fileType', 'menu'] }
                        }
                    },
                    checklist: {
                        $filter: {
                            input: '$clientFiles',
                            as: 'file',
                            cond: { $eq: ['$$file.fileType', 'checklist'] }
                        }
                    },
                    diets: {
                        $filter: {
                            input: '$clientFiles',
                            as: 'file',
                            cond: { $eq: ['$$file.fileType', 'diets'] }
                        }
                    }
                }
            },
            {
                $project: {
                    id: 1,
                    cateringId: 1,
                    info: 1,
                    name: 1,
                    code: 1,
                    createdAt: 1,
                    menu: {
                        $map: {
                            input: '$menu',
                            as: 'file',
                            in: { id: '$$file._id', s3Key: '$$file.s3Key' }
                        }
                    },
                    checklist: {
                        $map: {
                            input: '$checklist',
                            as: 'file',
                            in: { id: '$$file._id', s3Key: '$$file.s3Key' }
                        }
                    },
                    diets: {
                        $map: {
                            input: '$diets',
                            as: 'file',
                            in: { id: '$$file._id', s3Key: '$$file.s3Key' }
                        }
                    }
                }
            }
        )
    }

    return pipeline;
}

export default getClientsFilesListDbQuery;
