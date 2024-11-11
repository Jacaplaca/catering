import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { db } from '@root/app/server/db';
import { oneClientWithFiles } from '@root/app/validators/specific/clientFiles';
import { type ClientFilesCustomTable } from '@root/types/specific';
import { options } from '@root/app/server/api/specific/aggregate';
import getClientsFilesListDbQuery from '@root/app/server/api/routers/specific/libs/getClientsFilesListDbQuery';

const getOne = createCateringProcedure('dietician')
    .input(oneClientWithFiles)
    .query(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { clientId, day } = input;

        const pipeline = [
            ...getClientsFilesListDbQuery({ catering, id: clientId, day }),
        ]

        const clients = await db.client.aggregateRaw({
            pipeline,
            options
        }) as unknown as ClientFilesCustomTable[];

        if (!clients[0]) {
            throw new Error('Nie znaleziono klienta');
        }

        return clients[0];
    });

export default getOne;