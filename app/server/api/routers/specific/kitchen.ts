import { getQueryOrder } from '@root/app/lib/safeDbQuery';
import { db } from '@root/app/server/db';
import { getKitchensCountValid, getKitchensValid } from '@root/app/validators/specific/kitchens';
import { deleteElementsValid } from '@root/app/validators/deleteElements';
import { kitchensSortNames } from '@root/types/specific';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';

export const count = createCateringProcedure('manager')
    .input(getKitchensCountValid)
    .query(({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { searchValue } = input;

        return db.kitchen.count({
            where: {
                cateringId: catering.id,
                name: {
                    contains: searchValue,
                    mode: 'insensitive',
                },
            }
        });
    });

export const getMany = createCateringProcedure('manager')
    .input(getKitchensValid)
    .query(({ ctx, input }) => {
        const { session: { catering } } = ctx;
        const { searchValue, page, limit, sortName, sortDirection } = input;

        const orderBy = getQueryOrder({
            name: sortName,
            direction: sortDirection,
            allowedNames: kitchensSortNames,
        });

        return db.kitchen.findMany({
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

export const deleteMany = createCateringProcedure('manager')
    .input(deleteElementsValid)
    .mutation(({ ctx, input }) => {
        const { db, session } = ctx
        const { ids } = input;
        const { cateringId } = session.user;
        return db.kitchen.deleteMany({
            where: {
                id: {
                    in: ids
                },
                cateringId
            }
        });
    })

const kitchenRouter = {
    count,
    getMany,
    deleteMany,
}

export default kitchenRouter;