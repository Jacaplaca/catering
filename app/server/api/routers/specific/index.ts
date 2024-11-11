import { createTRPCRouter } from "server/api/trpc";
import media from '@root/app/server/api/routers/specific/media';
import settings from '@root/app/server/api/routers/specific/settings';
import tag from '@root/app/server/api/routers/specific/tag';
import dietician from '@root/app/server/api/routers/specific/dietician';
import kitchen from '@root/app/server/api/routers/specific/kitchen';
import consumer from '@root/app/server/api/routers/specific/consumer';
import client from '@root/app/server/api/routers/specific/client';
import order from '@root/app/server/api/routers/specific/order';
import clientFiles from '@root/app/server/api/routers/specific/clientFiles';

// Ensure that each of these routers is created by createTRPCRouter
const specificRouter = createTRPCRouter({
    client,
    media,
    settings: createTRPCRouter({
        ...settings,
        hasFinished: settings.hasFinished,
        get: settings.get
    }),
    tag,
    dietician,
    kitchen,
    consumer,
    order,
    clientFiles,
});

export default specificRouter;