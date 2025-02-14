import { api } from '@root/app/trpc/react';
import { useState } from 'react';

const useMonth = (clientId?: string) => {
    const [deliveryMonth, setDeliveryMonth] = useState<string | null>(null);

    const onClick = (key: string | null) => {
        setDeliveryMonth(state => state === key ? null : key);
    };

    const { data: monthData, isFetching: monthFetching }
        = api.specific.order.groupedByMonth.monthForClient.useQuery(
            { deliveryMonth: deliveryMonth ?? '', clientId },
            { enabled: Boolean(deliveryMonth) }
        );

    return {
        onClick,
        deliveryMonth,
        fetching: monthFetching,
        monthData
    };
};

export default useMonth;