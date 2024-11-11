import { readFileSync } from 'fs';
import { s3putPresign } from '@root/app/server/s3/presign';
import path from 'path';
import axios from 'axios';
import { getOldestKeys } from '@root/app/server/s3/list';
import { s3deleteKeys } from '@root/app/server/s3/delete';

const uploadFile = async ({ fileName, backupsDir, prefix, filesToKeep }:
    { fileName: string, backupsDir: string, prefix: string, filesToKeep: number }
) => {
    const got = await s3putPresign({ count: 1, prefix, key: fileName });

    if (got[0]) {
        const { url } = got[0];

        try {
            const backupPath = path.join(backupsDir, fileName);
            const fileContent = readFileSync(backupPath);
            await axios.put(url, fileContent, {
                headers: {
                    'Content-Type': 'application/gzip',
                    'Content-Length': fileContent.length,
                },
            });

            const oldestKeys = await getOldestKeys(prefix, filesToKeep);
            await s3deleteKeys(oldestKeys);


            console.log(`File ${fileName} uploaded successfully to ${prefix}`);
        } catch (uploadError) {
            console.error(`Error uploading file: ${JSON.stringify(uploadError)}`);
        }
    }
}

export default uploadFile;