const getPagination = (searchParams: URLSearchParams, totalCount: number) => {
    const pageStr = searchParams.get('page') ?? "1";
    const limitStr = searchParams.get('limit') ?? "10";
    const page = isNaN(parseInt(pageStr)) ? 1 : parseInt(pageStr)
    const limit = isNaN(parseInt(limitStr)) ? 10 : parseInt(limitStr)
    const totalPages = Math.ceil(totalCount / limit);
    const outOfRange = (page - 1) > totalPages || page < 1;
    const hasPrevPage = page > 1;
    const hasNextPage = totalPages > page;
    const firstElement = (page - 1) * limit + 1;
    const lastElement = Math.min(page * limit, totalCount);
    return {
        page,
        limit,
        totalPages,
        outOfRange,
        hasPrevPage,
        hasNextPage,
        firstElement,
        lastElement
    }
};

export default getPagination;