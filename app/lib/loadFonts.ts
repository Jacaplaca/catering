import fs from 'fs/promises';
import path from 'path';

let robotoRegular: Buffer | null = null;
let robotoBold: Buffer | null = null;

export async function loadFonts() {
    if (!robotoRegular || !robotoBold) {
        const fontsPath = path.join(process.cwd(), 'public', 'fonts');

        robotoRegular = await fs.readFile(path.join(fontsPath, 'roboto-regular.ttf'));
        robotoBold = await fs.readFile(path.join(fontsPath, 'roboto-bold.ttf'));
    }

    return {
        regular: robotoRegular,
        bold: robotoBold
    };
}