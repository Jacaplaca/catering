import { kitchensSortNames } from '@root/types/specific';
import { z } from 'zod';

export const getKitchensCountValid = z.object({
    searchValue: z.string().optional(),
});

export const getKitchensValid = z.object({
    limit: z.number().int().min(1).default(10),
    page: z.number().int().min(1).default(1),
    sortName: z.enum(kitchensSortNames).optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    searchValue: z.string().optional(),
});