import { api } from '@root/app/trpc/react';
import { format } from 'date-fns';
import { useState } from 'react';

const useClientMonth = (deliveryDate?: Date) => {
    const formattedDeliveryMonth = deliveryDate ? format(deliveryDate, 'yyyy-MM') : '';
    const [clientId, setClientId] = useState<string | null>(null);

    const onClick = (key: string | null) => {
        setClientId(state => state === key ? null : key);
    };

    const { data: monthData, isFetching: monthFetching }
        = api.specific.order.groupedByMonth.monthForClient.useQuery(
            { deliveryMonth: formattedDeliveryMonth ?? '', clientId: clientId ?? '' },
            { enabled: Boolean(formattedDeliveryMonth) && Boolean(clientId) }
        );

    return {
        onClick,
        deliveryMonth: formattedDeliveryMonth,
        fetching: monthFetching,
        clientId,
        monthData
    };
};

export default useClientMonth;