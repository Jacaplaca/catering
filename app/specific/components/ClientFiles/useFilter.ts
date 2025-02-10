import getCurrentTime from '@root/app/lib/date/getCurrentTime';
import { useState } from 'react';

const useClientsFilesFilter = () => {
    const [dayOfWeek, setDayOfWeek] = useState<Date>(new Date(getCurrentTime().setHours(15, 0, 0, 0)));

    const handleChangeDayOfWeek = (date: Date | null) => {
        if (date) {
            setDayOfWeek(date);
        }
    }

    return {
        week: {
            dayOfWeek,
            handleChangeDayOfWeek
        }
    };
}

export default useClientsFilesFilter;