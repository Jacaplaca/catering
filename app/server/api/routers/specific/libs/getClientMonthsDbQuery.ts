import { type Prisma } from '@prisma/client';

const getClientMonthsDbQuery = (clientId: string, filterMonth?: { year: number, month: number }): Prisma.InputJsonValue[] => {
    // Build initial match stage with clientId and only consider orders with status "completed"
    const match: { clientId: string, "deliveryDay.year"?: number, "deliveryDay.month"?: number, status: { $ne: string } } = { clientId, status: { $ne: 'draft' } };
    if (filterMonth) {
        if (
            Number.isInteger(filterMonth.year) &&
            Number.isInteger(filterMonth.month) &&
            filterMonth.month >= 1 &&
            filterMonth.month <= 12
        ) {
            match["deliveryDay.year"] = filterMonth.year;
            // Subtract 1 because the DB stores month as zero-based (0 = January, 11 = December)
            match["deliveryDay.month"] = filterMonth.month - 1;
        }
    }

    const groupStage: Prisma.InputJsonValue & { orders?: Prisma.InputJsonValue } = {
        _id: {
            year: "$deliveryDay.year",
            month: "$deliveryDay.month"
        },
        breakfastStandard: { $sum: "$breakfastStandard" },
        breakfastDiet: { $sum: "$breakfastDietCount" },
        lunchStandard: { $sum: "$lunchStandard" },
        lunchDiet: { $sum: "$lunchDietCount" },
        dinnerStandard: { $sum: "$dinnerStandard" },
        dinnerDiet: { $sum: "$dinnerDietCount" },
        id: {
            $first: {
                $concat: [
                    { $toString: "$deliveryDay.year" },
                    "-",
                    {
                        $cond: {
                            if: { $lt: ["$deliveryDay.month", 9] },
                            then: { $concat: ["0", { $toString: { $add: ["$deliveryDay.month", 1] } }] },
                            else: { $toString: { $add: ["$deliveryDay.month", 1] } }
                        }
                    }
                ]
            }
        },
    } as Prisma.InputJsonValue;

    // Initialize pipeline with the $match stage
    const pipeline: Prisma.InputJsonValue[] = [{ $match: match }];

    // If fetching detailed data for a specific month, add lookups for consumers
    if (filterMonth) {
        // // Lookup for breakfastDiet
        pipeline.push({
            $lookup: {
                from: 'OrderConsumerBreakfast',
                let: { orderId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$orderId", "$$orderId"] }
                        }
                    },
                    {
                        $lookup: {
                            from: 'Consumer',
                            localField: "consumerId",
                            foreignField: "_id",
                            as: "consumer"
                        }
                    },
                    { $unwind: "$consumer" },
                    { $replaceRoot: { newRoot: "$consumer" } }
                ],
                as: "breakfastDiet"
            }
        });
        // Lookup for lunchDiet
        pipeline.push({
            $lookup: {
                from: 'OrderConsumerLunch',
                let: { orderId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$orderId", "$$orderId"] }
                        }
                    },
                    {
                        $lookup: {
                            from: 'Consumer',
                            localField: "consumerId",
                            foreignField: "_id",
                            as: "consumer"
                        }
                    },
                    { $unwind: "$consumer" },
                    { $replaceRoot: { newRoot: "$consumer" } }
                ],
                as: "lunchDiet"
            }
        });
        // Lookup for dinnerDiet
        pipeline.push({
            $lookup: {
                from: 'OrderConsumerDinner',
                let: { orderId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$orderId", "$$orderId"] }
                        }
                    },
                    {
                        $lookup: {
                            from: 'Consumer',
                            localField: "consumerId",
                            foreignField: "_id",
                            as: "consumer"
                        }
                    },
                    { $unwind: "$consumer" },
                    { $replaceRoot: { newRoot: "$consumer" } }
                ],
                as: "dinnerDiet"
            }
        });

        // Include full order details (with lookup results) for later projection
        groupStage.orders = { $push: "$$ROOT" } as Prisma.InputJsonValue;
    }

    // Add the group stage to pipeline
    pipeline.push({ $group: groupStage });

    // // If fetching detailed data, restrict fields for each order
    if (filterMonth) {
        pipeline.push({
            $project: {
                breakfastStandard: 1,
                breakfastDiet: 1,
                lunchStandard: 1,
                lunchDiet: 1,
                dinnerStandard: 1,
                dinnerDiet: 1,
                id: 1,
                orders: {
                    $map: {
                        input: "$orders",
                        as: "order",
                        in: {
                            breakfastDiet: {
                                $map: {
                                    input: "$$order.breakfastDiet",
                                    as: "consumer",
                                    in: {
                                        name: "$$consumer.name",
                                        code: "$$consumer.code",
                                        diet: "$$consumer.diet",
                                        notes: "$$consumer.notes"
                                    }
                                }
                            },
                            lunchDiet: {
                                $map: {
                                    input: "$$order.lunchDiet",
                                    as: "consumer",
                                    in: {
                                        name: "$$consumer.name",
                                        code: "$$consumer.code",
                                        diet: "$$consumer.diet",
                                        notes: "$$consumer.notes"
                                    }
                                }
                            },
                            dinnerDiet: {
                                $map: {
                                    input: "$$order.dinnerDiet",
                                    as: "consumer",
                                    in: {
                                        name: "$$consumer.name",
                                        code: "$$consumer.code",
                                        diet: "$$consumer.diet",
                                        notes: "$$consumer.notes"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    return pipeline;
}

export default getClientMonthsDbQuery;
