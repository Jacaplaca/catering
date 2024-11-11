import { type FC } from 'react';

const DatePickerCustomHeader: FC<{
    locale: LocaleApp;
    date: Date;
    decreaseMonth: () => void;
    increaseMonth: () => void;
    prevMonthButtonDisabled: boolean;
    nextMonthButtonDisabled: boolean;
}> = ({
    locale,
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
}) => {
        return <div className="flex items-center justify-between px-4 py-2 ">
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                <i className={`fa-solid fa-arrow-left text-base text-neutral-700 dark:text-neutral-200
        ${prevMonthButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                ></i>
            </button>
            <span className={`font-bold text-sm text-neutral-700 dark:text-neutral-200 first-letter:uppercase`}>
                {date.toLocaleString(locale, { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                <i className={`fa-solid fa-arrow-right text-base text-neutral-700 dark:text-neutral-200
        ${nextMonthButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                ></i>
            </button>
        </div>;
    };

export default DatePickerCustomHeader;
