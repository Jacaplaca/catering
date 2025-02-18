import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { RoleType } from '@prisma/client';
import getCurrentTime from '@root/app/lib/date/getCurrentTime';

const time = createCateringProcedure([RoleType.manager, RoleType.kitchen, RoleType.client])
    .query(({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { timeZone } = catering.settings;

        const dateTime = getCurrentTime();
        console.log(dateTime);

        return dateTime;

    });


export default time;
