import getCurrentTime from '@root/app/lib/date/getCurrentTime';
import { startOfWeek, addWeeks, isBefore, setDay } from 'date-fns';

const dayToNumber = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
} as const;

type DayOfWeek = keyof typeof dayToNumber;

const getDaysOfWeeks = (pivotDay: DayOfWeek = 'saturday'): Date[] => {
    const today = getCurrentTime();
    const currentWeekMonday = startOfWeek(today, { weekStartsOn: 1 });
    const lastWeekMonday = addWeeks(currentWeekMonday, -1);
    const nextWeekMonday = addWeeks(currentWeekMonday, 1);

    // Convert pivot day to number
    const pivotDayNumber = dayToNumber[pivotDay];
    console.log(pivotDayNumber);

    // Check if today is before the pivot day of the current week
    const currentWeekPivotDay = setDay(currentWeekMonday, pivotDayNumber);
    console.log(currentWeekPivotDay);

    if (isBefore(today, currentWeekPivotDay)) {
        // If before pivot day, return last week's Monday and current week's Monday
        return [lastWeekMonday, currentWeekMonday];
    } else {
        // If pivot day or after, return last week's, current week's, and next week's Monday
        return [lastWeekMonday, currentWeekMonday, nextWeekMonday];
    }
}

export default getDaysOfWeeks;
