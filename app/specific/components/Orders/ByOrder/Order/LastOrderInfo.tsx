import { type DeliveryDay } from '@prisma/client';
import translate from '@root/app/lib/lang/translate';
import { format } from 'date-fns-tz';
import { type FC } from 'react';

const LastOrderInfo: FC<{
    day: DeliveryDay
    dictionary: Record<string, string>
}> = ({ day, dictionary }) => {
    return <div>
        <div className="flex flex-row p-0 sm:p-2 gap-1 sm:gap-2 items-center justify-center text-sm opacity-80 mt-1 sm:mt-4 italic">
            {translate(dictionary, 'orders:order_filled_with_last_order')}
            {format(new Date(day.year, day.month, day.day), 'dd-MM-yyyy')}
        </div>

    </div>
}

export default LastOrderInfo;