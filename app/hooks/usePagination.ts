import getPagination from '@root/app/lib/getPagination';
import { useSearchParams } from 'next/navigation';

const usePagination = (totalCount: number) => {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    return getPagination(params, totalCount ?? 0);
};

export default usePagination;