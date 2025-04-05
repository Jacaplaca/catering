/**
 * Validates the deliveryMonth string and returns a tuple [year, month].
 *
 * @param deliveryMonth - the input month string in format "YYYY-MM"
 * @returns [year, month]
 * @throws Error if the format is invalid
 */
function validateDeliveryMonth(deliveryMonth: string): [number, number] {
    const parts = deliveryMonth.split('-');
    if (parts.length !== 2) {
        throw new Error('Invalid deliveryMonth format: expected format "YYYY-MM"');
    }
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    if (!Number.isInteger(year) || !Number.isInteger(month)) {
        throw new Error('Invalid deliveryMonth: year and month must be valid integer numbers');
    }
    if (month < 1 || month > 12) {
        throw new Error('Invalid deliveryMonth: month must be between 1 and 12');
    }
    return [year, month];
}

export default validateDeliveryMonth;
