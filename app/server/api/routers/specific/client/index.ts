import getInfinite from '@root/app/server/api/routers/specific/client/getInfinite';
import count from '@root/app/server/api/routers/specific/client/count';
import deleteOne from '@root/app/server/api/routers/specific/client/deleteOne';
import getMany from '@root/app/server/api/routers/specific/client/getMany';
import edit from '@root/app/server/api/routers/specific/client/edit';
import getFull from '@root/app/server/api/routers/specific/client/getFull';
import getOne from '@root/app/server/api/routers/specific/client/getOne';
import getAll from '@root/app/server/api/routers/specific/client/getAll';
import activate from '@root/app/server/api/routers/specific/client/activate';
const clientRouter = {
    getInfinite,
    count,
    deleteOne,
    getMany,
    edit,
    getFull,
    getOne,
    getAll,
    activate,
}

export default clientRouter;
