import { dieticianSortNames } from '@root/types/specific';
import { z } from 'zod';

export const getDieticiansCountValid = z.object({
    searchValue: z.string().optional(),
});

export const getDieticiansValid = z.object({
    limit: z.number().int().min(1).default(10),
    page: z.number().int().min(1).default(1),
    sortName: z.enum(dieticianSortNames).optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    searchValue: z.string().optional(),
});