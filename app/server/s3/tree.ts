import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Client } from '@root/app/server/s3/s3';

export const listObjectsWithPrefix = async (prefix = '') => {
    const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET,
        Prefix: prefix,
        Delimiter: '/',
    });

    const response = await s3Client.send(command);

    const directories = response.CommonPrefixes?.map(prefixObj => prefixObj.Prefix) ?? [];
    return directories;
};

export const buildDirectoryTree = async (prefix = '') => {
    const subDirectories = (await listObjectsWithPrefix(prefix)).filter(Boolean) as string[];
    const tree = {} as Record<string, Record<string, unknown>>;

    for (const subDir of subDirectories) {
        tree[subDir] = await buildDirectoryTree(subDir);
    }

    return tree;
};