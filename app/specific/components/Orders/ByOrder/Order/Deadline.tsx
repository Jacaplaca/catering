import { OrderStatus } from '@prisma/client';
import translate from '@root/app/lib/lang/translate';
import { useOrderTableContext } from '@root/app/specific/components/Orders/ByOrder/context';
import { format } from 'date-fns-tz';
import { type FC } from 'react';

const DateInfo: FC<{ time: string, lastDay: Date | undefined }> = ({ time, lastDay }) => {
    return <span className='flex items-center gap-2'>
        <i className='fa-solid fa-calendar-days opacity-70 text-neutral-500 dark:text-neutral-400' />
        <span className="font-bold">{lastDay ? format(lastDay, 'dd-MM-yyyy') : ''}</span>
        <i className='fa-solid fa-clock opacity-70 text-neutral-500 dark:text-neutral-400' />
        <span className="font-bold">{time}</span>
    </span>
}

const Deadline: FC = () => {

    const {
        rowClick: {
            orderForEdit
        },
        order: { deadlines: { first, second, isBeforeFirst, canChange } },
        dictionary
    } = useOrderTableContext();

    const isDraft = orderForEdit?.status === OrderStatus.draft;
    const allow = isDraft ? isBeforeFirst : canChange;

    return <div className="flex flex-col justify-center items-center gap-4">
        <div className={`flex flex-col w-fit gap-4 text-sm justify-center items-center
        px-4 py-2 rounded-md
    ${allow
                ? 'text-neutral-900 dark:text-neutral-100 bg-neutral-300/65 dark:bg-neutral-700/65'
                : 'bg-red-500/65 dark:bg-red-700/65 text-white'}
        `}>

            {allow ? <div className='flex flex-row gap-2'>
                <span>{translate(dictionary, isBeforeFirst
                    ? 'orders:deadline_first_info'
                    : 'orders:deadline_second_info')} </span>
                {/* <span className="font-bold">{isBeforeFirst ? first.time : second.time}</span> */}
                <DateInfo
                    time={isBeforeFirst ? first.time : second.time}
                    lastDay={isBeforeFirst ? first.lastDay : second.lastDay}
                />
            </div> : <div>
                <span className="font-bold">{translate(dictionary, 'orders:deadline_is_over')}</span>
            </div>}
        </div>
    </div>
}


export default Deadline;