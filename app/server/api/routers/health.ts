import { getSetting } from '@root/app/server/cache/settings';
import { publicProcedure } from "server/api/trpc";

export const healthRouter = {
    check: publicProcedure
        .query(async () => {
            const isAppActive = await getSetting<boolean>('app', 'active');
            if (!isAppActive) {
                throw new Error('App is not active');
            }
            return {
                status: 'ok',
                message: 'Server is healthy',
            }
        }),
};