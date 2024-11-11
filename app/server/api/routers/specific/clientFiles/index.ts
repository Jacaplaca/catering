import count from '@root/app/server/api/routers/specific/clientFiles/count';
import getMany from '@root/app/server/api/routers/specific/clientFiles/getMany';
import save from '@root/app/server/api/routers/specific/clientFiles/save';
import remove from '@root/app/server/api/routers/specific/clientFiles/remove';
import getOne from '@root/app/server/api/routers/specific/clientFiles/getOne';
import asClient from '@root/app/server/api/routers/specific/clientFiles/asClient';
const clientFilesRouter = {
    count,
    getMany,
    save,
    remove,
    getOne,
    asClient,
}

export default clientFilesRouter;
