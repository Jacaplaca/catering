import { TagType } from '@prisma/client';
import { z } from 'zod';

// export const TableTypeValues = [ClipboardKey.clients_columns, ClipboardKey.consumers_columns] as const;

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const tagType = Object.values(TagType) as [TagType, ...TagType[]];

export const getTagsValid = z.object({
    name: z.string(),
    type: z.enum(tagType),
})

export const getTagListValid = z.object({
    name: z.string().optional(),
    type: z.enum(tagType).optional(),
    cursor: z.number().optional(),
    limit: z.number().min(1).max(100).default(50)
});

// export const getTagsValid = z.object({
//     key: z.enum(tagType),
// })

// export const updateTableColumnsValid = z.object({
//     key: z.enum(TableTypeValues),
//     columns: z.array(z.string()),
// })