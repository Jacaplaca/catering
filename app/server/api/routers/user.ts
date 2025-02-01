import create from '@root/app/server/api/routers/user/create';
import resetPassword from '@root/app/server/api/routers/user/resetPassword';
import changePasswordToken from '@root/app/server/api/routers/user/changePasswordToken';
import changePasswordSession from '@root/app/server/api/routers/user/changePasswordSession';
import changeEmailRequest from '@root/app/server/api/routers/user/changeEmailRequest';
import changeWeb3Address from '@root/app/server/api/routers/user/changeWeb3Address';
import count from '@root/app/server/api/routers/user/count';
import fetch from '@root/app/server/api/routers/user/fetch';
import remove from '@root/app/server/api/routers/specific/usersRemove';
import clients from '@root/app/server/api/routers/user/clients';

export const userRouter = {
    changeEmailRequest,
    changePasswordSession,
    changePasswordToken,
    resetPassword,
    create,
    changeWeb3Address,
    fetch,
    remove,
    count,
    clients
};