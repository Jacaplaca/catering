'use client';
import React from 'react';
import { type MealType } from '@root/types/specific';
import { useOrderByDayTableContext } from '@root/app/specific/components/Orders/ByDay/context';
import Icon from '@root/app/specific/components/Orders/ByDay/DayMealsCell/Icon';

const OrderPdf: React.FC<{ meal: MealType, dayId: string }> = ({ meal, dayId }) => {
    const {
        mealPdf: { isLoading, handleDownload, dayIdForPdf, mealTypeForPdf }
    } = useOrderByDayTableContext();

    const thisCell = dayIdForPdf === dayId && mealTypeForPdf === meal;
    const thisCellLoading = isLoading && thisCell;

    return (
        <button onClick={(e) => handleDownload(e, { dayId, mealType: meal })} disabled={thisCellLoading}>
            <Icon loading={thisCellLoading} icon="fa-file-pdf" />
        </button>
    )
};

export default OrderPdf;
