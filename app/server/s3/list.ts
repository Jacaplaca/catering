import { ListObjectsV2Command, type ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';
import { env } from '@root/app/env';
import { s3getPresign } from '@root/app/server/s3/presign';
import { s3Client } from '@root/app/server/s3/s3';

export const s3getList = async (prefix?: string) => {
    const listParams = {
        Bucket: env.S3_BUCKET,
        Prefix: prefix
    };

    try {
        const listedObjects = await s3Client.send(new ListObjectsV2Command(listParams));
        if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;
        return listedObjects;
    } catch (err) {
        console.error("Error", err);
    }
};

export const s3getKeys = async (prefix?: string) => {
    const listedObjects = await s3getList(prefix);
    if (!listedObjects) return [];

    if (!listedObjects?.Contents || listedObjects.Contents.length === 0) return [];

    return listedObjects.Contents.map(({ Key }) => Key).filter((key) => key) as string[];
}

export const s3getFiles = async (prefix?: string) => {
    const listedObjects = await s3getList(prefix);
    if (!listedObjects) return [];

    if (!listedObjects?.Contents || listedObjects.Contents.length === 0) return [];

    const list = listedObjects.Contents.map(({ Key }) => Key).filter((key) => key) as string[];
    if (list.length === 0) return [];
    return await s3getPresign(list);
};



function getExcessOldestKeys(bucketResponse: ListObjectsV2CommandOutput, filesToKeep: number): string[] {
    const { Contents } = bucketResponse;

    if (Contents && Contents.length <= filesToKeep) {
        return [];
    }

    // Sort Contents by LastModified date in ascending order (oldest first)
    const sortedContents = Contents?.sort((a, b) => {
        if (!a.LastModified || !b.LastModified) return 0;
        return new Date(a.LastModified).getTime() - new Date(b.LastModified).getTime()
    });

    // Calculate the number of excess files
    const excessCount = Contents && Contents.length - filesToKeep;

    // Extract the Keys of the oldest excess files
    const excessOldestKeys = sortedContents?.slice(0, excessCount).map(content => content.Key) ?? [];

    return excessOldestKeys.filter(key => key) as string[];
}

export const getOldestKeys = async (prefix: string, filesToKeep: number): Promise<string[]> => {
    const listedObjects = await s3getList(prefix);
    if (!listedObjects) return [];

    if (!listedObjects?.Contents || listedObjects.Contents.length === 0) return [];

    const excessOldestKeys = getExcessOldestKeys(listedObjects, filesToKeep);

    return excessOldestKeys;
}