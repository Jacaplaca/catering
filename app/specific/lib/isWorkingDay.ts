const isWorkingDay = (date: Date, timeZone = 'Europe/Warsaw'): boolean => {
    const options = { timeZone, weekday: 'long' } as const;
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const dayOfWeek = formatter.format(date);

    const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return workingDays.includes(dayOfWeek);
};

export default isWorkingDay;

