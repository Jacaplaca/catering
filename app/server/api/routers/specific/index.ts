import test from "server/api/routers/specific/test";
import media from '@root/app/server/api/routers/specific/media';
import settings from '@root/app/server/api/routers/specific/settings';
import tag from '@root/app/server/api/routers/specific/tag';
import dietician from '@root/app/server/api/routers/specific/dietician';
import kitchen from '@root/app/server/api/routers/specific/kitchen';
import consumer from '@root/app/server/api/routers/specific/consumer';
import client from '@root/app/server/api/routers/specific/client';
import order from '@root/app/server/api/routers/specific/order';
import clientFiles from '@root/app/server/api/routers/specific/clientFiles';

const specificRouter = {
    test,
    client,
    media,
    settings,
    tag,
    dietician,
    kitchen,
    consumer,
    order,
    clientFiles,
};

export default specificRouter;