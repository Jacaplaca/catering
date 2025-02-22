import isWorkingDay from '@root/app/specific/lib/isWorkingDay';

/**
 * Returns the next working day after the given date.
 *
 * @param startDate - The date from which to search the next working day (default: current date)
 * @param timeZone - The timezone used to check working days
 * @returns The next working day as a Date object
 */
export function getNextWorkingDay(
    startDate: Date = new Date(),
    timeZone: string
): Date {
    const nextDate = new Date(startDate.getTime());
    // Increment date by one day to ensure the returned day is in the future
    nextDate.setDate(nextDate.getDate() + 1);

    // Loop until a working day is found
    while (!isWorkingDay(nextDate, timeZone)) {
        nextDate.setDate(nextDate.getDate() + 1);
    }
    return nextDate;
}

export default getNextWorkingDay;