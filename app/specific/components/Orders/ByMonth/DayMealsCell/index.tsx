import OrderPdf from '@root/app/specific/components/Orders/ByDay/DayMealsCell/Pdf';
import { type MealType } from '@root/types/specific';
import { type FC } from 'react';

const MealCount: FC<{ count: number }> = ({ count }) => {
    return <div className={`
    flex justify-center
    text-gray-900 dark:text-gray-100 font-bold text-base
    ${count ? "opacity-100" : "opacity-70"}
    `}>
        {count ? count : '-'}
    </div>
}

const DayMealsCell: FC<{ standard: number, diet: number, meal: MealType, dayId: string }> = ({ standard, diet, meal, dayId }) => {
    return <div className="flex justify-center">
        <div className="flex gap-1 mr-4">
            <MealCount count={standard} />
            <div className="text-gray-900 dark:text-white text-base font-bold">/</div>
            <MealCount count={diet} />
        </div>
        <OrderPdf meal={meal} dayId={dayId} />
    </div>
}

export default DayMealsCell;