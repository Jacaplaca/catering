'use client';

import { pl } from 'date-fns/locale/pl';
import { forwardRef } from 'react';
import { registerLocale } from 'react-datepicker';
import { startOfWeek, endOfWeek } from 'date-fns';
import { format } from 'date-fns-tz';
import dateToWeek from '@root/app/specific/lib/dateToWeek';

registerLocale('pl', pl);

const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void; disabled?: boolean }>(
    ({ value, onClick, disabled }, ref) => {
        const date = new Date(value ?? '');
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
        const { week, weekYear } = dateToWeek(date);

        const dateFormat = weekStart.getFullYear() !== weekEnd.getFullYear() ? 'dd-MM-yyyy' : 'dd-MM';
        const dateRange = `${format(weekStart, dateFormat, { locale: pl })} - ${format(weekEnd, dateFormat, { locale: pl })} (${week}/${weekYear})`;

        return (
            <button onClick={onClick} ref={ref}
                className={`flex flex-row gap-2 items-center
                    px-4 py-2 rounded-md
                ${disabled ? "cursor-auto" : "hover:bg-secondary hover:dark:bg-darkmode-secondary-accent"}
                text-gray-900 dark:text-gray-100
                `}
            >
                <i className="fa-solid fa-calendar-week" />
                <span className="hidden md:block text-base font-bold">{dateRange}</span>
            </button>
        );
    },
);

CustomInput.displayName = 'CustomInputForWeekPicker';

export default CustomInput;