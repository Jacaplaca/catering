import { type DeliveryDay } from '@prisma/client';
import translate from '@root/app/lib/lang/translate';
import { format } from 'date-fns-tz';
import { type FC } from 'react';

const LastOrderInfo: FC<{
    day: DeliveryDay
    dictionary: Record<string, string>
}> = ({ day, dictionary }) => {
    return <div>
        <div className='flex flex-row gap-2 items-center justify-center text-sm opacity-80 mt-4 italic'>
            <span>{translate(dictionary, 'orders:order_filled_with_last_order')}</span>
            <span>{format(new Date(day.year, day.month, day.day), 'dd-MM-yyyy')}</span>
        </div>
    </div>
}

export default LastOrderInfo;