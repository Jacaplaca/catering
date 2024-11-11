import canPlaceOrder from '@root/app/specific/lib/canPlaceOrder';

const getDeadlinesStatus = ({ settings, day }: {
    settings?: {
        firstOrderDeadline: string;
        secondOrderDeadline: string;
        timeZone: string;
    }, day?: { year: number, month: number, day: number } | null
}) => {
    const deadlineFirst = { time: settings?.firstOrderDeadline, timeZone: settings?.timeZone }
    const deadlineSecond = { time: settings?.secondOrderDeadline, timeZone: settings?.timeZone }
    const deadlineFirstObj = canPlaceOrder({ orderDeadline: deadlineFirst, desiredDate: day, deadlineType: 'first' });
    const deadlineSecondObj = canPlaceOrder({ orderDeadline: deadlineSecond, desiredDate: day, deadlineType: 'second' });
    return {
        first: deadlineFirstObj,
        second: deadlineSecondObj,
        isBeforeFirst: deadlineFirstObj.canOrder,
        isBetween: !deadlineFirstObj.canOrder && deadlineSecondObj.canOrder,
        isAfterSecond: !deadlineSecondObj.canOrder,
        canChange: deadlineFirstObj.canOrder || deadlineSecondObj.canOrder,
    }
};

export default getDeadlinesStatus;