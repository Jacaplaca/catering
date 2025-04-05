import { useState } from 'react';

const useDeliveryMonth = () => {
    const [deliveryMonth, setDeliveryMonth] = useState<Date>(new Date());

    const onClick = (date: Date | null) => {
        setDeliveryMonth(date ?? new Date());
    };

    return {
        deliveryMonth,
        onClick
    };

};

export default useDeliveryMonth;