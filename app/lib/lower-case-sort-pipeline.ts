const getLowerCaseSort = (orderBy: Record<string, string | number>) => {
    const customFieldName = "_fieldForSort";

    if (!orderBy || !Object.keys(orderBy).length) {
        return []
    }

    const fieldName = Object.keys(orderBy)[0];
    const sortOrder = Object.values(orderBy)[0];

    return [
        {
            $addFields: {
                [customFieldName]: {
                    $cond: {
                        if: { $isNumber: `$${fieldName}` },
                        then: `$${fieldName}`,
                        else: { $toLower: `$${fieldName}` }
                    }
                }
            }
        },
        { $sort: { [customFieldName]: sortOrder } },
    ]
}

export default getLowerCaseSort;