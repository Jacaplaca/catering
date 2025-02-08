'use client';
import React from 'react';
import { type MealType } from '@root/types/specific';
import { useOrderByDayTableContext } from '@root/app/specific/components/Orders/ByDay/context';

const Icon = ({ loading }: { loading?: boolean }) => <i className={`fa-solid ${loading ?
    'fa-spinner-third fa-spin text-secondary dark:text-darkmode-secondary-accent'
    : 'fa-file-pdf'} 
text-xl w-6 text-secondary-accent dark:text-darkmode-secondary
hover:text-secondary dark:hover:text-darkmode-secondary-accent
`}></i>

const OrderPdf: React.FC<{ meal: MealType, dayId: string }> = ({ meal, dayId }) => {
    const {
        mealPdf: { isLoading, handleDownload, dayIdForPdf, mealTypeForPdf }
    } = useOrderByDayTableContext();

    const thisCell = dayIdForPdf === dayId && mealTypeForPdf === meal;
    const thisCellLoading = isLoading && thisCell;

    return (
        <button onClick={(e) => handleDownload(e, { dayId, mealType: meal })} disabled={thisCellLoading}>
            <Icon loading={thisCellLoading} />
        </button>
    )
};

export default OrderPdf;
