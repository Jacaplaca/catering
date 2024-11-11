import type { OrderConsumerBreakfast, OrderConsumerLunch, OrderConsumerDinner } from '@prisma/client';
import type { OrderMealPopulated } from '@root/types/specific';

const processMeals = (meals: (OrderConsumerBreakfast & OrderMealPopulated | OrderConsumerLunch & OrderMealPopulated | OrderConsumerDinner & OrderMealPopulated)[]) => {
    return meals.filter(meal => meal.consumer.code && meal.consumer.diet?.code).reduce((acc, meal) => {
        const code = meal.consumer.code;
        if (code) {
            acc[code] = meal.consumer.diet?.code ?? '';
        }
        return acc;
    }, {} as Record<string, string>);
}

export default processMeals;