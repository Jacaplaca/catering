import { PrismaClient } from "@prisma/client";
import { env } from '@root/app/env';
import { getDefaultSettings } from '@root/app/server/lib/defaultSettings';

const db = new PrismaClient();

async function initSettings() {
  try {
    const settings = await getDefaultSettings();

    for (const setting of settings) {
      if (env.RESET === 'yes') {
        await db.setting.upsert({
          where: { group_name: { group: setting.group, name: setting.name } },
          update: { access: setting.access, type: setting.type, value: setting.value },
          create: { ...setting }
        });
      } else {
        const existingSetting = await db.setting.findUnique({
          where: { group_name: { group: setting.group, name: setting.name } }
        });

        if (!existingSetting) {
          await db.setting.create({ data: setting });
        }
      }
    }
  } catch (error) {
    console.error('Error during settings initialization:', error);
  }
}

export default initSettings;