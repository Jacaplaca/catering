import isWorkingDay from '@root/app/specific/lib/isWorkingDay';

interface LastOrder {
    time?: string;
    timeZone?: string;
}

interface DesiredDate {
    year: number;
    month: number;
    day: number;
}

function canPlaceOrder(
    {
        orderDeadline,
        desiredDate,
        deadlineType
    }: {
        orderDeadline?: LastOrder,
        desiredDate?: DesiredDate | null,
        deadlineType: 'first' | 'second'
    }
): {
    canOrder: boolean;
    hoursLeft: number;
    isNonWorkingDay?: boolean;
    isDeadlinePassed?: boolean;
    time: string
    lastDay?: Date
} {
    const { time, timeZone } = orderDeadline ?? {};

    if (!time || !timeZone || !desiredDate) {
        return { canOrder: false, hoursLeft: 0, time: time ?? '--:--' };
    }

    // Function to get the current time in the specified time zone
    // const getTimeInTimeZone = (timeZone: string): { year: number, month: number, day: number, hours: number, minutes: number } => {
    //     const now = new Date();

    //     const options = {
    //         timeZone,
    //         hour12: false,
    //         hour: 'numeric',
    //         minute: 'numeric',
    //         second: 'numeric',
    //         year: 'numeric',
    //         month: 'numeric',
    //         day: 'numeric'
    //     } as const;
    //     const formatter = new Intl.DateTimeFormat('en-GB', options);

    //     const parts = formatter.formatToParts(now);
    //     const year = parseInt(parts.find(part => part.type === 'year')?.value ?? '0', 10);
    //     const month = parseInt(parts.find(part => part.type === 'month')?.value ?? '0', 10) - 1; // JS months are 0-indexed
    //     const day = parseInt(parts.find(part => part.type === 'day')?.value ?? '0', 10);
    //     const hours = parseInt(parts.find(part => part.type === 'hour')?.value ?? '0', 10);
    //     const minutes = parseInt(parts.find(part => part.type === 'minute')?.value ?? '0', 10);

    //     return { year, month, day, hours, minutes };
    // };

    // Function to check if the specified date is a working day


    // Function to calculate the difference in hours between two dates
    const hoursDifference = (startTime: Date, endTime: Date): number => {
        const diffMs = endTime.getTime() - startTime.getTime();
        return Math.floor(diffMs / (1000 * 60 * 60));
    };

    // Get the current time in the specified time zone
    // const currentTime = getTimeInTimeZone(timeZone);

    // Create a date object for the current time in the specified time zone
    // const currentDate = new Date(currentTime.year, currentTime.month, currentTime.day, currentTime.hours, currentTime.minutes);
    const currentDate = new Date();

    // Create a date object for the user's desired order date (year, month, day)
    const desiredOrderDate = new Date(desiredDate.year, desiredDate.month, desiredDate.day); // Months are 0-indexed

    // Check if the user selected a non-working day for the order
    if (!isWorkingDay(desiredOrderDate, timeZone)) {
        return { canOrder: false, hoursLeft: 0, isNonWorkingDay: true, time };
    }

    // Create a date object for example 18:00 on the day before the desired order date
    const deadlineDate = new Date(desiredOrderDate);
    const diff = deadlineType === 'first' ? 1 : 0; // Deadline (first) is the day before the order date or the same day if it's the second deadline
    deadlineDate.setDate(deadlineDate.getDate() - diff);
    while (!isWorkingDay(deadlineDate, timeZone)) {
        deadlineDate.setDate(deadlineDate.getDate() - diff); // Find the previous working day
    }

    // Set the time to example 18:00 on the day before the order
    const [orderHour, orderMinute] = time.split(':').map(Number);
    deadlineDate.setHours(orderHour ?? 0, orderMinute ?? 0, 0, 0);
    // console.log('desiredOrderDate', desiredDate, desiredOrderDate, deadlineDate);

    // Check if the order is placed after the deadline
    if (currentDate > deadlineDate) {
        return { canOrder: false, isDeadlinePassed: true, hoursLeft: 0, time };
    }

    // Calculate how many hours are left until the order deadline
    const hoursLeft = hoursDifference(currentDate, deadlineDate);
    return { canOrder: true, hoursLeft, time, lastDay: deadlineDate };
}


export default canPlaceOrder;