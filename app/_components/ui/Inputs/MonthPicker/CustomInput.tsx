'use client';

import { pl } from 'date-fns/locale/pl';
import { forwardRef } from 'react';
import { registerLocale } from 'react-datepicker';
import { format } from 'date-fns-tz';
import { isValid } from 'date-fns';

registerLocale('pl', pl);

const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void; disabled?: boolean }>(
    ({ value, onClick, disabled }, ref) => {

        let date: Date;
        if (value && /^\d{2}\/\d{4}$/.test(value)) {
            const parts = value.split('/');
            if (parts.length === 2 && parts[0] && parts[1]) {
                const [monthStr, yearStr] = parts;
                const month = parseInt(monthStr, 10);
                const year = parseInt(yearStr, 10);
                if (!isNaN(month) && !isNaN(year)) {
                    date = new Date(year, month - 1, 1);
                } else {
                    date = new Date(Date.now());
                }
            } else {
                date = new Date(Date.now());
            }
        } else {
            const parsedDate = new Date(value ?? Date.now());
            date = isValid(parsedDate) ? parsedDate : new Date(Date.now());
        }

        const validDate = isValid(date) ? date : new Date(Date.now());

        const monthYearFormat = 'LLLL yyyy';
        const formattedDate = format(validDate, monthYearFormat, { locale: pl });

        return (
            <button onClick={onClick} ref={ref}
                className={`flex flex-row gap-2 items-center
                    px-4 py-2 rounded-md
                ${disabled ? "cursor-auto" : "hover:bg-secondary hover:dark:bg-darkmode-secondary-accent"}
                text-gray-900 dark:text-gray-100
                `}
                disabled={disabled}
            >
                <i className="fa-solid fa-calendar-alt" />
                <span className="hidden md:block text-base font-bold">{formattedDate}</span>
                <span className="md:hidden text-base font-bold">{format(validDate, 'MMM yyyy', { locale: pl })}</span>
            </button>
        );
    },
);

CustomInput.displayName = 'CustomInputForMonthPicker';

export default CustomInput;