import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import { RoleType } from '@prisma/client';
import getCurrentTime from '@root/app/lib/date/getCurrentTime';

const time = createCateringProcedure([RoleType.manager, RoleType.kitchen, RoleType.client])
    .query(() => {
        const dateTime = getCurrentTime();
        return dateTime;

    });

export default time;
