import { readdir, lstat } from 'fs';
import path from 'path';

function readAllFromFolder(folderPath: string): void {
    readdir(folderPath, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            lstat(filePath, (err, stats) => {
                if (err) throw err;

                if (stats.isDirectory()) {
                    readAllFromFolder(filePath);
                } else {
                    console.log(`File: ${filePath}`);
                }
            });
        }
    });
}

export default readAllFromFolder;