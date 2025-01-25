import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { db } from '@root/app/server/db';
import { activateClientValidator } from '@root/app/validators/specific/client';

const activate = createCateringProcedure('manager')
    .input(activateClientValidator)
    .mutation(({ input }) => {
        const { ids } = input;

        return db.client.updateMany({
            where: { id: { in: ids } },
            data: { deactivated: false },
        });
    });

export default activate;
