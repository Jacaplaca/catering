import { getQueryOrder } from '@root/app/lib/safeDbQuery';
import { db } from '@root/app/server/db';
import { getDieticiansCountValid, getDieticiansValid } from '@root/app/validators/specific/dietician';
import { deleteElementsValid } from '@root/app/validators/deleteElements';
import { dieticianSortNames } from '@root/types/specific';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';

const count = createCateringProcedure('manager')
    .input(getDieticiansCountValid)
    .query(({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { searchValue } = input;

        return db.dietician.count({
            where: {
                cateringId: catering.id,
                name: {
                    contains: searchValue,
                    mode: 'insensitive',
                },
            }
        });
    });

const getMany = createCateringProcedure('manager')
    .input(getDieticiansValid)
    .query(({ ctx, input }) => {
        const { session: { catering } } = ctx;
        const { searchValue, page, limit, sortName, sortDirection } = input;

        const orderBy = getQueryOrder({
            name: sortName,
            direction: sortDirection,
            allowedNames: dieticianSortNames,
        });

        return db.dietician.findMany({
            where: {
                cateringId: catering.id,
                name: {
                    contains: searchValue,
                    mode: 'insensitive',
                },
            },
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
        });
    });

const deleteMany = createCateringProcedure('manager')
    .input(deleteElementsValid)
    .mutation(({ ctx, input }) => {
        const { db, session } = ctx
        const { ids } = input;
        const { cateringId } = session.user;
        return db.dietician.deleteMany({
            where: {
                id: {
                    in: ids
                },
                cateringId
            }
        });
    })

const dieticiansRouter = {
    count,
    getMany,
    deleteMany
};

export default dieticiansRouter;