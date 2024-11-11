import { env } from '@root/app/env';
import { exec } from 'child_process';
import path from 'path';
import cron from 'node-cron';
import uploadFile from '@root/app/server/lib/makeBackup/upload';
import db2Archive from '@root/app/server/lib/makeBackup/db2Archive';
import getSafeDate from '@root/app/lib/date/safeDate';

const isProduction = env.NODE_ENV === 'production';
const backup_cron = env.BACKUP_CRON;
const filesToKeep = parseInt(env.BACKUP_KEEP);
const dumpDir = isProduction ? 'dump' : 'app/assets/db/dump';
const backupsDir = isProduction ? 'backups' : 'app/assets/db/backups';
const s3prefix = isProduction ? 'backups/prod' : 'backups/dev';

async function dbBackup() {
    console.log('Backup process started');

    const fileName = `db_${env.APP_NAME}_${getSafeDate()}.tar.gz`;

    if (!isProduction) {
        await db2Archive({ fileName, backupsDir, dumpDir });
        await uploadFile({ fileName, backupsDir, prefix: s3prefix, filesToKeep });
        return fileName;
    }

    const dbUrl = env.DATABASE_URL;
    const mongodumpCommand = `mongodump --uri=${dbUrl}`;
    const backupPath = path.join(backupsDir, fileName);
    const tarCommand = `tar -czvf ${backupPath} ${dumpDir}`;
    const clearBackupsDirCommand = `rm -rf ${backupsDir}/*`;
    const clearDumpDirCommand = `rm -rf ${dumpDir}/*`;

    isProduction && exec(clearBackupsDirCommand, (clearBackupError, clearBackupStdout, clearBackupStderr) => {
        if (clearBackupError) {
            console.error(`Error clearing backupsDir: ${clearBackupError.message}`);
            return;
        }

        if (clearBackupStderr) {
            console.error(`Error clearing backupsDir stderr: ${clearBackupStderr}`);
            return;
        }

        exec(clearDumpDirCommand, (clearDumpError, clearDumpStdout, clearDumpStderr) => {
            if (clearDumpError) {
                console.error(`Error clearing dumpDir: ${clearDumpError.message}`);
                return;
            }

            if (clearDumpStderr) {
                console.error(`Error clearing dumpDir stderr: ${clearDumpStderr}`);
                return;
            }

            exec(mongodumpCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing backup: ${error.message}`);
                    return;
                }

                if (stderr && !stderr.includes('WARNING:')) {
                    console.error(`mongodump process stderr: ${stderr}`);
                    return;
                }

                console.log(`Backup process stdout: ${stdout}`);

                exec(tarCommand, (tarError, tarStdout, tarStderr) => {
                    if (tarError) {
                        console.error(`Error creating tar.gz: ${tarError.message}`);
                        return;
                    }

                    if (tarStderr) {
                        console.error(`tar process stderr: ${tarStderr}`);
                        return;
                    }

                    void uploadFile({ fileName, backupsDir, prefix: s3prefix, filesToKeep });
                    console.log(`Backup successfully created at ${backupPath}`);
                    return fileName;

                });
            });
        });
    });
}

cron.schedule(backup_cron, () => {
    if (isProduction) {
        void dbBackup(); // run automatically when import?
    }
});

export default dbBackup;
