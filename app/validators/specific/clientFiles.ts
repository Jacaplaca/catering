import { ClientFileType } from '@prisma/client';
import { clientFilesSortNames } from '@root/types/specific';
import { z } from 'zod';

export const getClientsFiles = z.object({
    day: z.date(),
    limit: z.number().int().min(1).default(10),
    page: z.number().int().min(1).default(1),
    sortName: z.enum(clientFilesSortNames).optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    searchValue: z.string().optional(),
});


export const getClientsFilesCount = z.object({
    day: z.date(),
    searchValue: z.string().optional(),
});

export const saveClientsFiles = z.object({
    day: z.date(),
    s3ObjectKeys: z.array(z.string()),
    fileName: z.string(),
    fileType: z.nativeEnum(ClientFileType),
    clientIds: z.array(z.string()),
});

export const removeClientFilesByIds = z.object({
    ids: z.array(z.string()),
});

export const oneClientWithFiles = z.object({
    clientId: z.string(),
    day: z.date(),
    fileType: z.nativeEnum(ClientFileType).optional(),
});

export const removeClientFilesByTypeAndClientIdsValid = z.object({
    fileType: z.nativeEnum(ClientFileType).optional(),
    clientIds: z.array(z.string()).optional(),
    day: z.date(),
});
