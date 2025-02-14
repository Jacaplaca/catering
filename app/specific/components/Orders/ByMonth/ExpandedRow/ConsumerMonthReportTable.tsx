import translate from '@root/app/lib/lang/translate';
import { useOrderByMonthTableContext } from '@root/app/specific/components/Orders/ByMonth/context';
import React from 'react';

// HeadCell Component
interface HeadCellProps {
    children: React.ReactNode;
    className?: string;
}
const HeadCell: React.FC<HeadCellProps> = ({ children, className }) => {
    return (
        <th
            className={`px-6 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider ${className ?? ''}`}
        >
            {children}
        </th>
    );
};

// ContentCell Component
interface ContentCellProps {
    children: React.ReactNode;
    className?: string;
}
const ContentCell: React.FC<ContentCellProps> = ({ children, className }) => {
    return (
        <td className={`px-6 py-2 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100 ${className ?? ''}`}>
            {children}
        </td>
    );
};

/* ConsumerMonthReportTable Component
   This component renders a report table with Tailwind CSS styling,
   featuring smaller row heights and dark mode support.
*/
export const ConsumerMonthReportTable: React.FC = () => {
    const {
        dictionary,
        row: { monthData },
    } = useOrderByMonthTableContext();

    if (!monthData) return null;

    // Helper function to render the value or "-" if the count is 0
    const renderCount = (value: number): React.ReactNode => (value === 0 ? "-" : value);

    // Calculate totals for breakfast, lunch, dinner and total diet meals across all clients
    const totals = Object.values(monthData).reduce(
        (acc, client) => ({
            breakfast: acc.breakfast + client.breakfast,
            lunch: acc.lunch + client.lunch,
            dinner: acc.dinner + client.dinner,
            sum: acc.sum + client.sum,
        }),
        { breakfast: 0, lunch: 0, dinner: 0, sum: 0 }
    );

    return (
        <div className="flex flex-col items-center justify-center p-4">
            {/* Title */}
            <div className="mb-4 text-lg  font-semibold text-neutral-800 dark:text-neutral-200">
                {translate(dictionary, 'orders:consumer_diet_meals')}
            </div>
            <div className="w-full overflow-x-auto rounded-md max-w-[700px]">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-600 shadow-lg">
                    <thead className="bg-neutral-50 dark:bg-neutral-700">
                        <tr>
                            <HeadCell>{translate(dictionary, 'orders:consumer')}</HeadCell>
                            <HeadCell className="text-center">{translate(dictionary, 'orders:breakfast')}</HeadCell>
                            <HeadCell className="text-center">{translate(dictionary, 'orders:lunch')}</HeadCell>
                            <HeadCell className="text-center">{translate(dictionary, 'orders:dinner')}</HeadCell>
                            <HeadCell className="text-center">{translate(dictionary, 'orders:total_diet_meals')}</HeadCell>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-600">
                        {Object.entries(monthData).map(([id, client]) => (
                            <tr key={id} className="hover:bg-neutral-100 dark:hover:bg-neutral-700">
                                <ContentCell>{client.name}</ContentCell>
                                <ContentCell className="text-center">{renderCount(client.breakfast)}</ContentCell>
                                <ContentCell className="text-center">{renderCount(client.lunch)}</ContentCell>
                                <ContentCell className="text-center">{renderCount(client.dinner)}</ContentCell>
                                <ContentCell className="text-center font-semibold">{renderCount(client.sum)}</ContentCell>
                            </tr>
                        ))}
                        {/* Totals row */}
                        <tr className="bg-neutral-200 dark:bg-neutral-600">
                            <ContentCell className="font-bold">Total</ContentCell>
                            <ContentCell className="text-center font-bold">{renderCount(totals.breakfast)}</ContentCell>
                            <ContentCell className="text-center font-bold">{renderCount(totals.lunch)}</ContentCell>
                            <ContentCell className="text-center font-bold">{renderCount(totals.dinner)}</ContentCell>
                            <ContentCell className="text-center font-bold">{renderCount(totals.sum)}</ContentCell>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};