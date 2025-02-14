import { type ConsumerMonthReport } from '@root/types/specific';

/**
 * Generates a summary report for diet orders per consumer.
 *
 * @param orders - Array of order objects with lookup arrays for diet consumers.
 * @returns Report object keyed by consumer code with counts for breakfast, lunch, dinner, and the total sum.
 */
function getConsumersMonthReport(orders: Array<{
    breakfastDiet: Array<{ code: string; name: string; diet: { code: string; description: string }; notes: string }>,
    lunchDiet: Array<{ code: string; name: string; diet: { code: string; description: string }; notes: string }>,
    dinnerDiet: Array<{ code: string; name: string; diet: { code: string; description: string }; notes: string }>
}>): ConsumerMonthReport {
    // Initialize summary object
    const report: ConsumerMonthReport = {};

    // Process each order in the orders array
    orders.forEach(order => {
        // Process breakfastDiet consumers
        order.breakfastDiet.forEach(consumer => {
            let summary = report[consumer.code];
            if (!summary) {
                summary = { name: consumer.name, breakfast: 0, lunch: 0, dinner: 0, sum: 0 };
                report[consumer.code] = summary;
            }
            summary.breakfast += 1;
            summary.sum += 1;
        });

        // Process lunchDiet consumers
        order.lunchDiet.forEach(consumer => {
            let summary = report[consumer.code];
            if (!summary) {
                summary = { name: consumer.name, breakfast: 0, lunch: 0, dinner: 0, sum: 0 };
                report[consumer.code] = summary;
            }
            summary.lunch += 1;
            summary.sum += 1;
        });

        // Process dinnerDiet consumers
        order.dinnerDiet.forEach(consumer => {
            let summary = report[consumer.code];
            if (!summary) {
                summary = { name: consumer.name, breakfast: 0, lunch: 0, dinner: 0, sum: 0 };
                report[consumer.code] = summary;
            }
            summary.dinner += 1;
            summary.sum += 1;
        });
    });

    // Sort the report keys based on consumer's name using Polish locale
    const sortedKeys = Object.keys(report).sort((a, b) => {
        const reportA = report[a];
        const reportB = report[b];
        if (!reportA || !reportB) return 0;
        return reportA.name.localeCompare(reportB.name, 'pl');
    });
    const sortedReport: ConsumerMonthReport = {} as ConsumerMonthReport;
    sortedKeys.forEach(key => {
        sortedReport[key] = report[key]!;
    });

    return sortedReport;
}

export default getConsumersMonthReport;