import path from 'path';
import { readdir, lstat, rmdir, unlink } from 'fs';

const deleteFolderContents = (folderPath: string): void => {
    readdir(folderPath, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            lstat(filePath, (err, stats) => {
                if (err) throw err;

                if (stats.isDirectory()) {
                    deleteFolderContents(filePath); // Recursive call
                    rmdir(filePath, (err) => {
                        if (err) throw err;
                        console.log(`Dir removed: ${filePath}`);
                    });
                } else {
                    unlink(filePath, (err) => {
                        if (err) throw err;
                        console.log(`File removed: ${filePath}`);
                    });
                }
            });
        }
    });
};

export default deleteFolderContents;