import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { env } from '@root/app/env';
import { s3getList } from '@root/app/server/s3/list';
import { s3Client } from '@root/app/server/s3/s3';

export const s3deleteFromPrefix = async (prefix?: string) => {
    const listedObjects = await s3getList(prefix);

    try {

        if (!listedObjects?.Contents || listedObjects.Contents.length === 0) return;

        const deleteParams = {
            Bucket: env.S3_BUCKET,
            Delete: { Objects: [] }
        } as { Bucket: string; Delete: { Objects: { Key: string }[] } };

        listedObjects.Contents.forEach(({ Key }) => {
            if (Key) deleteParams.Delete.Objects.push({ Key });
        });

        await s3Client.send(new DeleteObjectsCommand(deleteParams));

        if (listedObjects.IsTruncated) await s3deleteFromPrefix(prefix);
    } catch (err) {
        console.error("Error", err);
    }
}

export const s3deleteKeys = async (keys: string[]) => {
    const deleteParams = {
        Bucket: env.S3_BUCKET,
        Delete: { Objects: [] }
    } as { Bucket: string; Delete: { Objects: { Key: string }[] } };

    keys.forEach((key) => {
        deleteParams.Delete.Objects.push({ Key: key });
    });

    await s3Client.send(new DeleteObjectsCommand(deleteParams));
};
