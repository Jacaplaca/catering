import { db } from '@root/app/server/db';
import { type OrderForEdit } from '@root/types/specific';

const getOrder = async ({ orderId, cateringId }: { orderId: string, cateringId?: string }) => {

    type MatchObject = {
        cateringId?: string;
        _id?: string;
    };

    const match: MatchObject = {}

    if (orderId) {
        match._id = orderId;
    }

    if (cateringId) {
        match.cateringId = cateringId;
    }

    const result = await db.order.aggregateRaw({
        pipeline: [
            { $match: match },
            {
                $lookup: {
                    from: 'OrderConsumerBreakfast',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'breakfastDiet'
                }
            },
            {
                $lookup: {
                    from: 'OrderConsumerLunch',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'lunchDiet'
                }
            },
            {
                $lookup: {
                    from: 'OrderConsumerDinner',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'dinnerDiet'
                }
            },
            {
                $lookup: {
                    from: 'OrderConsumerLunchBeforeDeadline',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'lunchDietBeforeDeadline'
                }
            },
            {
                $lookup: {
                    from: 'OrderConsumerDinnerBeforeDeadline',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'dinnerDietBeforeDeadline'
                }
            },
            {
                $project: {
                    id: '$_id',
                    status: 1,
                    standards: {
                        breakfast: '$breakfastStandard',
                        lunch: '$lunchStandard',
                        dinner: '$dinnerStandard'
                    },
                    diet: {
                        breakfast: '$breakfastDiet.consumerId',
                        lunch: '$lunchDiet.consumerId',
                        dinner: '$dinnerDiet.consumerId'
                    },
                    dietBeforeDeadline: {
                        lunch: '$lunchDietBeforeDeadline.consumerId',
                        dinner: '$dinnerDietBeforeDeadline.consumerId'
                    },
                    standardsBeforeDeadline: {
                        lunch: '$lunchStandardBeforeDeadline',
                        dinner: '$dinnerStandardBeforeDeadline'
                    },
                    day: '$deliveryDay',
                }
            },
            {
                $project: {
                    id: 1,
                    status: 1,
                    standards: 1,
                    diet: 1,
                    dietBeforeDeadline: 1,
                    standardsBeforeDeadline: 1,
                    day: {
                        year: '$day.year',
                        month: '$day.month',
                        day: '$day.day'
                    }
                }
            }
        ]
    });

    if (!Array.isArray(result) || result.length === 0) {
        throw new Error('orders:order_not_found');
    }

    const rawOrder = result[0] as unknown as OrderForEdit;

    return rawOrder;

}

export default getOrder;