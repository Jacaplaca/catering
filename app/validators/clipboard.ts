import { ClipboardKey } from '@prisma/client';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const clipboardKey = Object.values(ClipboardKey) as [ClipboardKey, ...ClipboardKey[]];

export const setClipboard = z.object({
    key: z.enum(clipboardKey),
    value: z.string(),
})

export const getClipboard = z.object({
    key: z.enum(clipboardKey),
})

