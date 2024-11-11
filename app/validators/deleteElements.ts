import { z } from 'zod';

export const deleteElementsValid = z
    .object({
        ids: z.array(z.string()),
    })