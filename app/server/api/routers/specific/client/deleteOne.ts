import { RoleType } from '@prisma/client';
import removeClients from '@root/app/server/api/routers/specific/libs/removeClients';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { deleteElementsValid } from '@root/app/validators/deleteElements';

const deleteOne = createCateringProcedure([RoleType.manager])
    .input(deleteElementsValid)
    .mutation(({ ctx, input }) => {
        const { db, session } = ctx
        const { ids } = input;
        const { cateringId } = session.user;
        return removeClients({ clientsIds: ids, cateringId, forceRemove: false });
    })

export default deleteOne;