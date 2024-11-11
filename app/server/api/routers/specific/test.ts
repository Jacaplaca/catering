import { publicProcedure } from '@root/app/server/api/trpc';

const test = publicProcedure
    .query(({ }) => {
        return 'Hello World';
    })

export default test;