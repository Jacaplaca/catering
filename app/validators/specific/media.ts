import { z } from 'zod';

export const logoUploadValid = z.object({
    key: z.string(),
    mode: z.enum(['light', 'dark']),
});