import HighlightText from '@root/app/_components/Table/HighlightText';
import SkeletonCell from '@root/app/_components/Table/SkeletonCell';
import { type OrderGroupedByClientAndMonthCustomTable } from '@root/types/specific';
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

const useByClientAndMonthDataGrid = ({
    rows,
    limit,
    totalCount,
    columns,
}: {
    rows: OrderGroupedByClientAndMonthCustomTable[]
    limit: number,
    totalCount: number,
    columns: { key: string }[],
}) => {

    const skeletonRowsCount = limit > totalCount ? totalCount : limit
    const skeleton = Array.from({ length: skeletonRowsCount }, (_, i) => {
        return {
            key: `skeleton-${i}`,
            rows: columns.map(({ key }) => {
                return {
                    component: <SkeletonCell />,
                    key
                }
            })
        }
    })

    const table = rows.map(({
        id,
        breakfastStandard,
        lunchStandard,
        dinnerStandard,
        breakfastDiet,
        lunchDiet,
        dinnerDiet,
        client
    }, i) => {
        return {
            key: id ?? `placeholderData-${i}`,
            rows: [
                {
                    component: <HighlightText
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex justify-start"
                        text={client?.info?.name ?? '-'}
                    />,
                    key: 'client.info.name'
                },
                {
                    component: <HighlightText
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex justify-start"
                        text={client?.info?.code ?? '-'}
                    />,
                    key: 'client.info.code'
                },
                {
                    component: <MealCount count={breakfastStandard} />,
                    key: 'breakfastStandard'
                },
                {
                    component: <MealCount count={lunchStandard} />,
                    key: 'lunchStandard'
                },
                {
                    component: <MealCount count={dinnerStandard} />,
                    key: 'dinnerStandard'
                },
                {
                    component: <MealCount count={breakfastDiet} />,
                    key: 'breakfastDiet'
                },
                {
                    component: <MealCount count={lunchDiet} />,
                    key: 'lunchDiet'
                },
                {
                    component: <MealCount count={dinnerDiet} />,
                    key: 'dinnerDiet'
                },
            ]
        }
    });

    return { skeleton, table }

}

export default useByClientAndMonthDataGrid;