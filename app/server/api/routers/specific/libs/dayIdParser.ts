const dayIdParser = (dayId: unknown, monthIndexStart = 0) => {
    // Ensure the input is a non-empty string
    if (typeof dayId !== 'string' || !dayId.trim()) {
        throw new Error('dayId must be a non-empty string');
    }

    // Split the dayId by '-' and check that we have exactly three parts
    const parts = dayId.split('-');
    if (parts.length !== 3) {
        throw new Error("dayId must be formatted as 'YYYY-MM-DD'");
    }
    const [yearStr, monthStr, dayStr] = parts;

    // Convert string parts to numbers
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    // Validate that conversion to numbers was successful
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error('dayId contains invalid number parts');
    }

    // Normalize the month to 0-indexed value based on monthIndexStart.
    // If monthIndexStart is 1, then the input month is 1-indexed (i.e. 1=January)
    // So we convert it by subtracting 1.
    // If monthIndexStart is 0, then the input month is already 0-indexed.
    const normalizedMonth = monthIndexStart === 1 ? month - 1 : month;

    // Validate normalized month range [0, 11]
    if (normalizedMonth < 0 || normalizedMonth > 11) {
        throw new Error('Invalid month in dayId');
    }

    // Validate day range using the maximum day in the month for the given year.
    // We add 1 to normalizedMonth to get the next month (Date constructor months are 0-indexed)
    const maxDay = new Date(year, normalizedMonth + 1, 0).getDate();
    if (day < 1 || day > maxDay) {
        throw new Error('Invalid day in dayId for the given month and year');
    }

    return { year, month: normalizedMonth, day };
};

export default dayIdParser;

