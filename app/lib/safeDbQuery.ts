export const getQueryPagination = ({
    page = 1,
    limit = 10
}: {
    page?: number;
    limit?: number;
}) => {
    const maxLimit = 100;
    const goodLimit = limit > maxLimit ? maxLimit : limit;

    return {
        skip: (page - 1) * goodLimit,
        take: goodLimit
    }
}

export const getQueryOrder = ({
    allowedNames,
    name,
    direction,
    inNumbers = false
}: {
    allowedNames: string[] | readonly string[];
    name?: string;
    direction?: string;
    inNumbers?: boolean;
}) => {
    const allowedDirections = ['asc', 'desc'];
    const toNumber = {
        asc: 1,
        desc: -1
    } as Record<string, number>;
    const orderBy: Record<string, number | string> = {};
    if (name
        && direction
        && allowedNames.includes(name)
        && allowedDirections.includes(direction)) {
        const dirInNumber = toNumber[direction] ?? 1;
        const newDirection = inNumbers ? dirInNumber : direction;
        orderBy[name] = newDirection;
    }
    return orderBy;
}