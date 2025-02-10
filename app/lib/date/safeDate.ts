import getCurrentTime from '@root/app/lib/date/getCurrentTime';

const padZero = (num: number): string => num.toString().padStart(2, '0');

const getSafeDate = (): string => {
    const now = getCurrentTime();
    const year = now.getFullYear();
    const month = padZero(now.getMonth() + 1);
    const day = padZero(now.getDate());
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const seconds = padZero(now.getSeconds());
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

export default getSafeDate;