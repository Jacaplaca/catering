import { useState } from 'react';

const useClientsFilesFilter = () => {
    const [dayOfWeek, setDayOfWeek] = useState<Date>(new Date(new Date().setHours(15, 0, 0, 0)));

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