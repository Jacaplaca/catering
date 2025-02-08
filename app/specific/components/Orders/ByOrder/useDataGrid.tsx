import { OrderStatus, RoleType } from '@prisma/client';
import HighlightText from '@root/app/_components/Table/HighlightText';
import SkeletonCell from '@root/app/_components/Table/SkeletonCell';
import Checkbox from '@root/app/_components/ui/Inputs/Checkbox';
import Status from '@root/app/specific/components/ui/OrderStatusSelect/Status';
import { type OrdersCustomTable } from '@root/types/specific';
import { format } from 'date-fns-tz';
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

const useOrderDataGrid = ({
    rows,
    idsChecked,
    toggleCheck,
    searchValue,
    limit,
    totalCount,
    columns,
    dictionary,
    roleId
}: {
    rows: OrdersCustomTable[]
    idsChecked: string[]
    toggleCheck: (id: string) => void
    searchValue: string,
    limit: number,
    totalCount: number,
    columns: { key: string }[],
    dictionary: Record<string, string>,
    roleId?: RoleType
}) => {

    const skeletonRowsCount = limit > totalCount ? totalCount : limit
    const skeleton = Array.from({ length: skeletonRowsCount }, (_, i) => {
        return {
            key: `skeleton-${i}`,
            rows: [
                {
                    component: <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        checked={false}
                        skeleton
                        onChange={() => { return void 0 }}
                    />,
                    className: "p-1 md:p-4 w-6"
                },
                ...columns.map(({ key }) => {
                    return {
                        component: <SkeletonCell />,
                        key
                    }
                })
            ]
        }
    })

    const table = rows.map(({ id, client, deliveryDay, status, breakfastStandard,
        lunchStandard, dinnerStandard, breakfastDietCount, lunchDietCount, dinnerDietCount, sentToCateringAt }, i) => {
        const isDraft = status === OrderStatus.draft;
        const isClient = roleId === RoleType.client;
        const disableMainCheckbox = !isDraft && isClient;
        const deliveryDayDate = new Date(deliveryDay?.year ?? 0,
            deliveryDay?.month ?? 0,
            deliveryDay?.day ?? 0);
        return {
            key: id ?? `placeholderData-${i}`,
            rows: [
                {
                    component: <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        checked={idsChecked.includes(id)}
                        onChange={() => toggleCheck(id)}
                        disabled={disableMainCheckbox}
                        className={`${disableMainCheckbox ? "opacity-50" : ""}`}
                    />,
                    className: "p-1 md:p-4 w-6",
                },
                {
                    component: <HighlightText
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex justify-center"
                        text={deliveryDayDate ? format(deliveryDayDate, 'dd-MM-yyyy') : ''}
                    />,
                    key: 'deliveryDay'
                },
                {
                    component: <Status status={status} dictionary={dictionary} />,
                    key: 'status'
                },
                {
                    component: <HighlightText
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                        text={client?.name ?? ""}
                        fragment={searchValue} />,
                    key: 'client.name'
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
                    component: <MealCount count={breakfastDietCount} />,
                    key: 'breakfastDietCount'
                },
                {
                    component: <MealCount count={lunchDietCount} />,
                    key: 'lunchDietCount'
                },
                {
                    component: <MealCount count={dinnerDietCount} />,
                    key: 'dinnerDietCount'
                },
                {
                    component: <HighlightText
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex justify-center"
                        text={sentToCateringAt?.$date ? format(sentToCateringAt.$date, 'dd-MM-yyyy HH:mm') : ''}
                    />,
                    key: 'sentToCateringAt'
                },
            ]
        }
    });

    return { skeleton, table }

}

export default useOrderDataGrid;