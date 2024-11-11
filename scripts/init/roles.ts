import { PrismaClient, type Role } from "@prisma/client";
import { join, basename, extname } from 'path';
import { env } from '@root/app/env';
import fs from 'fs';
const db = new PrismaClient();

async function initRoles() {

  const folderPath = join(process.cwd(), 'app', "assets", 'roles');

  const users = await db.user.findMany();

  const files = fs.readdirSync(folderPath, { withFileTypes: true })
    .filter((file) => file.isFile() && file.name.endsWith('.json'));

  const rolesFromHdd = [] as (Role & { translation: Record<string, string> })[]

  for (const file of files) {
    const fileName = file.name;
    const filePath = join(folderPath, fileName);
    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8')) as (Role & { translation: Record<string, string> })[]
    fileContent.forEach((role) => {
      rolesFromHdd.push(role);
    })
  }

  if (env.RESET === 'yes' && users.length === 0) {
    await db.role.deleteMany({});
  }

  for (const role of rolesFromHdd) {
    const { translation, ...rest } = role;
    const id = rest.id;
    const roleInDb = await db.role.findUnique({
      where: { id }
    });

    if (!roleInDb) {
      await db.role.create({
        data: rest
      })
    }
  }
}

export default initRoles;