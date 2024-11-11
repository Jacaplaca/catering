import { OrderStatus } from "@prisma/client";

const statusColor: Record<OrderStatus | 'default', string> = {
    [OrderStatus.draft]: 'bg-blue-300 dark:bg-blue-700',
    [OrderStatus.in_progress]: 'bg-rose-300 dark:bg-rose-700',
    [OrderStatus.completed]: 'bg-lime-300 dark:bg-lime-700',
    default: 'bg-neutral-200 dark:bg-neutral-700'
};

export default statusColor;
