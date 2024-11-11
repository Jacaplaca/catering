import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { deleteElementsValid } from '@root/app/validators/deleteElements';

const deleteOne = createCateringProcedure('manager')
    .input(deleteElementsValid)
    .mutation(({ ctx, input }) => {
        const { db, session } = ctx
        const { ids } = input;
        const { cateringId } = session.user;
        return db.client.deleteMany({
            where: {
                id: {
                    in: ids
                },
                cateringId
            }
        });
    })

export default deleteOne;