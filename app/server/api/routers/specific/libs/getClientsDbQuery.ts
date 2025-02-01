import { type Prisma, type Catering } from '@prisma/client';

const getClientsDbQuery = ({
    searchValue,
    showColumns,
    catering,
    id,
    tagId
}: {
    searchValue?: string,
    catering: Catering,
    showColumns?: string[],
    id?: string,
    tagId?: string
    // role?: RoleType | 'all'
}) => {
    const orConditions = showColumns?.map(column => ({
        [column]: { $regex: searchValue, $options: 'i' },
    })) ?? [];

    type MatchObject = {
        cateringId?: string;
        id?: string;
        deactivated?: boolean;
        $or?: Record<string, {
            $regex?: string;
            $options?: string;
        }>[];
    };

    const query: MatchObject = {
        cateringId: catering.id,
        deactivated: false
    }

    if (id) {
        query.id = id;
    }

    if (searchValue && showColumns?.length) {
        query.$or = orConditions
    }

    const pipeline = [
        {
            $addFields: {
                id: '$_id'
            }
        },
        {
            $addFields: {
                code: '$info.code',
                deactivated: '$deactivated'
            }
        },
        // {
        //     $addFields: {
        //         "settings.lastOrderTime": { $ifNull: ['$settings.lastOrderTime', catering.settings.lastOrderTime] }  // Jeśli ownName jest null, ustaw 'Default Name'
        //     }
        // },
        {
            $project: {
                _id: 0,
                id: 1,
                cateringId: 1,
                info: 1,
                settings: 1,
                name: 1,
                code: 1,
                createdAt: 1,
                tags: 1,
                deactivated: 1,
                // 'user.name': 1
            }
        },
        {
            $match: query
        },
    ] as Prisma.InputJsonValue[]

    if (tagId) {
        pipeline.unshift({
            $match: {
                'tags.tagId': tagId
            }
        })
        pipeline.unshift({
            $lookup: {
                from: 'TagClient',
                localField: '_id',
                foreignField: 'clientId',
                as: 'tags',
                // preserveNullAndEmptyArrays: true
            }
        })
    }

    return pipeline;

}

export default getClientsDbQuery;