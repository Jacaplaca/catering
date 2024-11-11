import { addMissingSettings, getSetting, updateSetting } from '@root/app/server/cache/settings';
import { addMissingTranslations, cleanupTranslations } from '@root/app/server/cache/translations';
import fs from 'fs/promises';

type UpdateFunction = () => Promise<void>;

const group = 'app';
const name = 'dbVer';
const updatePath = `${__dirname}/update/specific`;

const update = async () => {
    await addMissingSettings();
    await addMissingTranslations();
    await cleanupTranslations();
    const dbVer = await getSetting<number>(group, name);
    const files = await fs.readdir(updatePath);
    console.log("CurrentDB version:", dbVer);

    const updateFiles = files
        .filter(file => {
            const versionNumber = parseInt(file.split('.')[0]!);
            return !isNaN(versionNumber) && versionNumber > dbVer;
        })
        .sort((a, b) => {
            const versionA = parseInt(a.split('.')[0]!);
            const versionB = parseInt(b.split('.')[0]!);
            return versionA - versionB;
        });

    for (const file of updateFiles) {
        const fileNumber = parseInt(file.split('.')[0]!);
        const { default: updateFunction } = await import(`${updatePath}/${file}`) as { default: UpdateFunction };
        await updateFunction();
        await updateSetting({ group, name, value: fileNumber, refreshCache: true });
    }
}

export default update