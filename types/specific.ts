import { type Client, type Diet, type Dietician, type ClientInfo, type OrderStatus, type Consumer, type DeliveryDay } from '@prisma/client';
import { type TableTypeValues } from '@root/app/validators/settings';
import { type orderForEditValid } from '@root/app/validators/specific/order';
import { type z } from 'zod';

export const clientSortNames = ['name', 'email', 'code', "info.name", "info.email", "info.phone",
    "info.address", "info.city", "info.zip", "info.contactPerson", "info.country",
    // 'settings.lastOrderTime'
] as const;

export type ClientsSortName = typeof clientSortNames[number];

export const clientFilesSortNames = ['name', 'code'] as const;

export type ClientFilesSortName = typeof clientFilesSortNames[number];
export const usersSortNames = ['name', 'email'] as const;

export type UsersSortName = typeof usersSortNames[number];

export const dieticianSortNames = ['name'] as const;

export type DieticianSortName = typeof dieticianSortNames[number];

export const kitchensSortNames = ['name'] as const;

export type KitchensSortName = typeof kitchensSortNames[number];

export type ClientCustomTable = {
    id: string;
    userId: string;
    cateringId: string;
    // settings: ClientSettings;
    info: ClientInfo;
    name?: string;
    email?: string;
    code: number;
    tags: string[];
    deactivated: boolean;
    createdAt: Date;
    updatedAt: Date;

};

export const consumersSortNames = ['name', 'client.name', 'client.code', 'diet.description', 'diet.dietician.name', 'code', 'diet.code', 'createdAt'] as const;

export type ConsumersSortName = typeof consumersSortNames[number];

export type ConsumerCustomTable = {
    id: string;
    name?: string;
    code: string;
    client: {
        name: string;
        code: string;
        id: string;
    };
    clientId: string;
    diet: Diet;
    notes?: string;
    dietician: Dietician;
    deactivated?: boolean;
    createdAt: { $date: Date };
};

export const ordersSortNames = ['deliveryDay', 'status', 'client.name'] as const;

export type OrdersSortName = typeof ordersSortNames[number];

export const ordersGroupedByDaySortNames = ['deliveryDay'] as const;

export type OrdersGroupedByDaySortName = typeof ordersGroupedByDaySortNames[number];

export const ordersGroupedByMonthSortNames = ['id', 'breakfastStandard', 'lunchStandard', 'dinnerStandard', 'breakfastDiet', 'lunchDiet', 'dinnerDiet'] as const;

export type OrdersGroupedByMonthSortName = typeof ordersGroupedByMonthSortNames[number];

export type OrdersCustomTable = {
    id: string;
    deliveryDay: DeliveryDay;
    status: OrderStatus;
    client: {
        name: string;
        code: string;
        id: string;
    };
    clientId: string;
    breakfastStandard: number;
    lunchStandard: number;
    dinnerStandard: number;
    breakfastDietCount: number;
    lunchDietCount: number;
    dinnerDietCount: number;
    sentToCateringAt: { $date: Date };
};

export type OrderGroupedByDayCustomTable = {
    id: string,
    deliveryDay: DeliveryDay;
    breakfastStandard: number;
    lunchStandard: number;
    dinnerStandard: number;
    breakfastDietCount: number;
    lunchDietCount: number;
    dinnerDietCount: number;
    sentToCateringAt: { $date: Date };
}

export type OrderGroupedByMonthCustomTable = {
    id: string,
    breakfastStandard: number;
    breakfastDiet: number;
    lunchStandard: number;
    lunchDiet: number;
    dinnerStandard: number;
    dinnerDiet: number;
    sentToCateringAt: { $date: Date };
}

export type ConsumerMonthReport = Record<string, { name: string; breakfast: number; lunch: number; dinner: number; sum: number }>

export type OrderForView = {
    id: string;
    status: OrderStatus;
    standards: {
        breakfast: number;
        lunch: number;
        dinner: number;
    };
    diet: {
        breakfast: Array<Consumer & { diet: Diet | null }>;
        lunch: Array<Consumer & { diet: Diet | null }>;
        dinner: Array<Consumer & { diet: Diet | null }>;
    };
    day: {
        year: number;
        month: number;
        day: number;
    };
};

export type TableType = typeof TableTypeValues[number];

export enum MealType {
    Breakfast = 'breakfast',
    Lunch = 'lunch',
    Dinner = 'dinner',
}

// export type OrderForEdit = z.infer<typeof orderForEditValid> & { status: OrderStatus };

export type OrderForEdit = {
    id: string;
    status: OrderStatus;
    standards: {
        breakfast: number;
        lunch: number;
        dinner: number;
    };
    diet: {
        breakfast: string[];
        lunch: string[];
        dinner: string[];
    };
    dietBeforeDeadline: {
        lunch: string[];
        dinner: string[];
    };
    day: {
        year: number;
        month: number;
        day: number;
    };
    note: string;
};

export type ClientFilesCustomTable = {
    id: string;
    cateringId: string;
    info: ClientInfo;
    name?: string;
    code: string;
    menu: { id: string, s3Key: string }[];
    checklist: { id: string, s3Key: string }[];
    diets: { id: string, s3Key: string }[];
};

export type OrderMealPopulated = { consumer: Consumer & { diet: Diet } }