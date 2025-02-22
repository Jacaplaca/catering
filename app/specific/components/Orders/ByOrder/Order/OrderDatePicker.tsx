import { type FC, forwardRef } from "react";
import DatePicker from '@root/app/_components/ui/Inputs/DatePicker';
import { pl } from 'date-fns/locale/pl';
import { registerLocale } from 'react-datepicker';
import { useOrderTableContext } from '@root/app/specific/components/Orders/ByOrder/context';
import { format } from 'date-fns-tz';
import Deadline from '@root/app/specific/components/Orders/ByOrder/Order/Deadline';
import getDeadlinesStatus from '@root/app/specific/lib/getDeadlinesStatus';
import getCurrentTime from '@root/app/lib/date/getCurrentTime';
import { getNextWorkingDay } from '@root/app/lib/date/getNextWorkingDay';

registerLocale('pl', pl);

const ExampleCustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
        <button onClick={onClick} ref={ref}
            className={`flex flex-row gap-2 items-center px-2 sm:px-4 py-1 sm:py-2 rounded-md
            hover:bg-secondary hover:dark:bg-darkmode-secondary-accent
            text-gray-900 dark:text-gray-100
            `}
        >
            <i className="fa-solid fa-calendar-days" />
            <span className="whitespace-nowrap block text-base font-bold">{value}</span>
        </button>
    ),
);

ExampleCustomInput.displayName = 'ExampleCustomInput';

const OrderDatePicker: FC = () => {

    const {
        lang,
        order: {
            updateDay,
            day,
            orderedDates,
            settings: cateringSettings,
        }
    } = useOrderTableContext();

    if (!day || !cateringSettings?.timeZone) return null;

    const dayDate = day && new Date(day.year, day.month, day.day);
    const dayDateString = format(dayDate, 'yyyy-MM-dd');

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const year = date.getFullYear();
            const month = date.getMonth();
            const dayNum = date.getDate();
            updateDay({ year, month, day: dayNum });
        }
    };
    const minDate = getCurrentTime();
    const maxDate = getNextWorkingDay(new Date(), cateringSettings?.timeZone);
    // maxDate.setDate(maxDate.getDate() + 14);
    const blockedDays = orderedDates ?? [];


    const filterDate = (date: Date) => {
        const day = date.getDay();
        const dateString = format(date, 'yyyy-MM-dd');
        const today = getCurrentTime();
        today.setHours(0, 0, 0, 0); // reset time to start of day


        const unblocked = (
            day !== 0 && // not Sunday
            day !== 6 && // not Saturday
            !blockedDays.includes(dateString) &&
            date >= today // date is not earlier than today
        );

        if (unblocked) {
            const dayObj = { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
            const status = cateringSettings && getDeadlinesStatus({ settings: cateringSettings, day: dayObj });
            return Boolean(status?.isBeforeFirst);
        }

        return false;
    };

    return (
        <div className="flex flex-col md:flex-row gap-1 md:gap-4 justify-center items-center w-full pb-2 md:pb-4">
            {/* <label className="font-normal text-base">{translate(dictionary, 'orders:date_picker_label')}</label> */}
            <DatePicker
                locale={lang}
                dateFormat="yyyy-MM-dd"
                minDate={minDate}
                selected={dayDateString}
                CustomInput={<ExampleCustomInput />}
                onSelect={handleDateChange}
                maxDate={maxDate}
                filterDate={filterDate}
                dayClassName={(date) => {
                    const dateString = format(date, 'yyyy-MM-dd');
                    return blockedDays.filter(blockedDate => new Date(blockedDate) >= new Date(minDate)).includes(dateString)
                        ? 'react-datepicker__day--ordered'
                        : '';
                }}
            />
            <Deadline />
        </div>
    );
};

export default OrderDatePicker;
