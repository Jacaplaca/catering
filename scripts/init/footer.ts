import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
import footer from '@root/app/assets/footer.json';

async function initFooter(reset = false) {
  if (process.env.RESET === 'yes' || reset) {
    await db.setting.deleteMany({
      where: {
        group: 'navigation', name: 'footer'
      }
    });
  }
  const footerInDb = await db.setting.findUnique({
    where: { group_name: { group: 'navigation', name: 'footer' } }
  });

  if (!footerInDb) {
    await db.setting.create({
      data: {
        access: 'PUBLIC',
        group: 'navigation',
        name: 'footer',
        type: 'OBJECT',
        value: JSON.stringify(footer)
      }
    })
  }

}

export default initFooter;