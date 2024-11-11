// import { type Consumer, type RoleType } from '@prisma/client';
import getLowerCaseSort from '@root/app/lib/lower-case-sort-pipeline';
import { getQueryOrder, getQueryPagination } from '@root/app/lib/safeDbQuery';
import getConsumerDbQuery from '@root/app/server/api/routers/specific/libs/getConsumersDbQuery';
import getJobId from '@root/app/server/api/routers/specific/libs/getJobId';
import { options } from '@root/app/server/api/specific/aggregate';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { db } from '@root/app/server/db';
import { consumerEditValidator, deleteConsumersValid, getConsumerValid, getConsumersCountValid, getConsumersValid } from '@root/app/validators/specific/consumer';
import { type ConsumerCustomTable, consumersSortNames } from '@root/types/specific';

const dietaryAll = createCateringProcedure(['client'])
    .query(async ({ ctx }) => {
        const { session: { catering } } = ctx;

        const clientId = await getJobId({
            userId: ctx.session.user.id,
            cateringId: catering.id,
            roleId: 'client'
        });

        const allowedSortNames = consumersSortNames;

        const orderBy = getQueryOrder({
            name: 'name',
            direction: 'asc',
            allowedNames: allowedSortNames,
            inNumbers: true
        });

        return await db.consumer.aggregateRaw({
            pipeline: [
                ...getConsumerDbQuery({
                    withDiet: true,
                    showColumns: ['name', 'code']
                    , catering, clientId, withNameOnly: true
                }),
                ...getLowerCaseSort(orderBy),
            ],
            options
        }) as unknown as (ConsumerCustomTable & { name: string })[];

    });


// const getInfinite = createCateringProcedure(['client'])
//     .input(getConsumerListValid)
//     .query(async ({ input, ctx }) => {
//         const { session: { catering } } = ctx;
//         const { cursor, limit } = input;
//         const skip = cursor ?? 0;

//         const clientId = await getJobId({
//             userId: ctx.session.user.id,
//             cateringId: catering.id,
//             roleId: 'client'
//         });

//         const showColumns = ['name', 'code'];
//         const sortName = 'name';
//         const sortDirection = 'asc';
//         const searchValue = '';

//         const allowedSortNames = consumersSortNames;

//         const pipeFirst = getConsumerDbQuery({ searchValue, showColumns, catering, clientId, withNameOnly: true });

//         const count = await db.consumer.aggregateRaw({
//             pipeline: [
//                 ...pipeFirst,
//                 { $count: 'count' },
//             ]
//         }) as unknown as { count: number }[];

//         const orderBy = getQueryOrder({
//             name: sortName,
//             direction: sortDirection,
//             allowedNames: allowedSortNames,
//             inNumbers: true
//         });

//         const pipeline = [
//             ...pipeFirst,
//             ...getLowerCaseSort(orderBy),
//             { $skip: skip },
//             { $limit: limit },
//         ]

//         const items = await db.consumer.aggregateRaw({
//             pipeline
//         }) as unknown as (ConsumerCustomTable & { name: string })[];

//         const totalCount = count[0]?.count ?? 0;
//         const nextCursor = skip + limit < totalCount ? skip + limit : undefined;

//         return {
//             items,
//             nextCursor,
//             totalCount,
//         };
//     });

const getMany = createCateringProcedure(['manager', 'dietician', 'client'])
    .input(getConsumersValid)
    .query(async ({ input, ctx }) => {
        const { session: { catering, user } } = ctx;
        const { page, limit, sortName, sortDirection, customerSearchValue, dietSearchValue, showColumns, clientId } = input;

        const pagination = getQueryPagination({ page, limit });

        const allowedSortNames = consumersSortNames;

        const orderBy = getQueryOrder({
            name: sortName,
            direction: sortDirection,
            allowedNames: allowedSortNames,
            inNumbers: true
        });

        const jobId = user.roleId === 'client' ? await getJobId({
            userId: user.id,
            cateringId: catering.id,
            roleId: 'client'
        }) : undefined;

        const pipeline = [
            ...getConsumerDbQuery({ customerSearchValue, dietSearchValue, showColumns, catering, clientId: jobId ? jobId : clientId }),
            ...getLowerCaseSort(orderBy),
            { $skip: pagination.skip },
            { $limit: pagination.take },
        ]

        return db.consumer.aggregateRaw({
            pipeline,
            options
        }) as unknown as ConsumerCustomTable[];
    });

const count = createCateringProcedure(['manager', 'dietician', 'client'])
    .input(getConsumersCountValid)
    .query(async ({ input, ctx }) => {
        const { session: { catering, user } } = ctx;
        const { customerSearchValue, dietSearchValue, showColumns, clientId } = input;

        const jobId = user.roleId === 'client' ? await getJobId({
            userId: user.id,
            cateringId: catering.id,
            roleId: 'client'
        }) : undefined;

        const count = await db.consumer.aggregateRaw({
            pipeline: [
                ...getConsumerDbQuery({ customerSearchValue, dietSearchValue, showColumns, catering, clientId: jobId ? jobId : clientId }),
                { $count: 'count' },
            ]
        }) as unknown as { count: number }[];
        return count[0]?.count ?? 0;
    });

const getOne = createCateringProcedure(['dietician', 'client', 'manager'])
    .input(getConsumerValid)
    .query(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { id } = input;

        const clients = await db.consumer.aggregateRaw({
            pipeline: getConsumerDbQuery({ id, catering })
        }) as unknown as ConsumerCustomTable[];
        return clients[0];
    });


// const handleDiet = async ({
//     diet,
//     userId,
//     roleId,
//     consumer
// }: {
//     diet: z.infer<typeof consumerEditValidator>['diet'];
//     userId: string;
//     roleId: RoleType;
//     consumer: Consumer;
// }) => {
//     if (!diet) return;

//     const { id: consumerId, dietId, cateringId } = consumer;

//     const dieticianId = await getJobId({
//         userId,
//         cateringId,
//         roleId
//     });

//     const { description, notes } = diet;

//     const createDiet = !dietId && dieticianId && (description ?? notes);
//     if (createDiet) {
//         const code = await getNewCode({
//             cateringId,
//             modelName: "diet"
//         });

//         const newDiet = await db.diet.create({
//             data: {
//                 code,
//                 cateringId,
//                 dieticianId,
//                 description,
//                 notes
//             }
//         });
//         return db.consumer.update({
//             where: { id: consumerId },
//             data: { dietId: newDiet.id }
//         })

//     }
//     if (dietId && (description ?? notes)) {
//         return db.diet.update({
//             where: { id: dietId },
//             data: { description, notes, dieticianId }
//         })
//     }
// }

const addOne = createCateringProcedure(['dietician', 'manager'])
    .input(consumerEditValidator)
    .mutation(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { name, client, notes, diet, code } = input;
        const cateringId = catering.id;

        const goodCode = code.trim().toUpperCase();

        const clientWithCode = await db.consumer.findFirst({
            where: {
                cateringId,
                code: goodCode
            }
        });

        if (clientWithCode) {
            throw new Error("consumers:duplicate_code_error");
        }


        return db.consumer.create({
            data: {
                code: goodCode,
                name,
                cateringId,
                clientId: client.id,
                notes,
                dieticianId: ctx.session.user.id,
                diet
            }
        });

        // return handleDiet({
        //     diet,
        //     userId: ctx.session.user.id,
        //     roleId: ctx.session.user.roleId,
        //     consumer: newConsumer
        // })
    });


const edit = createCateringProcedure(['dietician', 'manager'])
    .input(consumerEditValidator)
    .mutation(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { id, name, client, notes, diet, code } = input;

        const goodCode = code.trim().toUpperCase();

        const consumerWithCode = await db.consumer.findFirst({
            where: {
                cateringId: catering.id,
                code: goodCode,
                id: {
                    not: id
                }
            }
        });

        if (consumerWithCode) {
            throw new Error("consumers:duplicate_code_error");
        }

        return await db.consumer.update({
            where: { id },
            data: {
                name,
                code: goodCode,
                clientId: client.id,
                cateringId: catering.id,
                notes,
                diet
            }
        });

        // return handleDiet({
        //     diet,
        //     userId: ctx.session.user.id,
        //     roleId: ctx.session.user.roleId,
        //     consumer: updatedConsumer
        // })
    });

const deleteOne = createCateringProcedure(['dietician', 'manager'])
    .input(deleteConsumersValid)
    .mutation(async ({ input, ctx }) => {
        const { ids } = input;
        const { session: { catering } } = ctx;
        const cateringId = catering.id;

        return db.consumer.deleteMany({
            where: { id: { in: ids }, cateringId }
        });

    });

const consumerRouter = {
    // getInfinite,
    getMany,
    count,
    getOne,
    addOne,
    edit,
    deleteOne,
    dietaryAll,
};

export default consumerRouter;
