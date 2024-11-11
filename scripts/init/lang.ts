import { PrismaClient } from "@prisma/client";
import { env } from '@root/app/env';
import { addMissingTranslations } from '@root/app/server/cache/translations';
const db = new PrismaClient();

async function initLang(forceReset = false) {
  if (env.RESET === 'yes' || forceReset) {
    await db.translation.deleteMany({
      where: {
        NOT: {
          group: 'page'
        }
      }
    });
  }
  await addMissingTranslations();
}

export default initLang;