import { getWeek, getWeekYear } from 'date-fns';

const dateToWeek = (date: Date) => {
    const week = getWeek(date, { weekStartsOn: 1, firstWeekContainsDate: 4 });
    const weekYear = getWeekYear(date, { weekStartsOn: 1, firstWeekContainsDate: 4 });

    return { week, weekYear };
}

export default dateToWeek;