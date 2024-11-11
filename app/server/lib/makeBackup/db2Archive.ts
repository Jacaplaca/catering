import { env } from '@root/app/env';
import { createReadStream, writeFileSync, createWriteStream } from 'fs';
import deleteFolderContents from '@root/app/server/lib/disk/deleteFolderContents';
import archiver from 'archiver';
import { MongoClient } from 'mongodb';
import path from 'path';

const db2Archive = async ({ fileName, backupsDir, dumpDir }:
    { fileName: string, backupsDir: string, dumpDir: string }
) => {
    try {
        deleteFolderContents(backupsDir);
        const backupPath = path.join(backupsDir, fileName);
        const mongoUri = env.DATABASE_URL;
        const mongoClient = new MongoClient(mongoUri, {});

        await mongoClient.connect();
        const database = mongoClient.db();
        const collections = await database.listCollections().toArray();


        const output = createWriteStream(backupPath);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const archive = archiver('tar', {
            gzip: true,
            zlib: { level: 9 } // Maximum compression
        });

        output.on('close', function () {
            console.log(`Archiwum utworzone, rozmiar: ${archive.pointer()} bajtów`);
        });

        output.on('end', function () {
            console.log('Dane przesłane do archiwum.');
        });

        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                console.warn(err);
            } else {
                throw err;
            }
        });

        archive.on('error', function (err) {
            throw err;
        });

        archive.pipe(output);

        for (const collection of collections) {
            const collectionName = collection.name;
            const data = await database.collection(collectionName).find({}).toArray();

            const filePath = path.join(dumpDir, `${collectionName}.json`);
            writeFileSync(filePath, JSON.stringify(data, null, 2));
            archive.append(createReadStream(filePath), { name: `${collectionName}.json` });
        }
        // archive.directory(dumpDir, false);
        await mongoClient.close();
        console.log('Backup created successfully');

        await archive.finalize();
        await mongoClient.close();
        deleteFolderContents(dumpDir);
    } catch (error) {
        console.error('Error listing collections:', error);
        return [];
    }
};

export default db2Archive;