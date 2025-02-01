import { getTagListValid, getTagsValid } from '@root/app/validators/tag';
import { db } from '@root/app/server/db';
import { RoleType, type Prisma } from '@prisma/client';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';

const getMany = createCateringProcedure([RoleType.manager])
  .input(getTagsValid)
  .query(({ input, ctx }) => {
    const { name, type } = input;
    return db.tag.findMany({
      where: {
        type,
        cateringId: ctx.session.catering.id,
        name: {
          startsWith: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
      }
    });
  });

const getInfinite = createCateringProcedure([RoleType.manager, RoleType.kitchen])
  .input(getTagListValid)
  .query(async ({ input, ctx }) => {
    const { session: { catering } } = ctx;
    const { cursor, limit, name, type } = input;
    const skip = cursor ?? 0;

    // await new Promise(resolve => setTimeout(resolve, 1000));

    const where = {
      cateringId: catering.id,
      name: {
        startsWith: name,
        mode: 'insensitive',
      },
      type,
    } as Prisma.TagWhereInput;

    const [items, totalCount] = await Promise.all([
      db.tag.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
        select: {
          id: true,
          name: true,
        },
        take: limit,
        skip,
      }),
      db.tag.count({ where })
    ]) as [{ id: string, name: string }[], number];

    const nextCursor = skip + limit < totalCount ? skip + limit : undefined;

    return {
      items,
      nextCursor,
    };
  });

const tagRouter = {
  getMany,
  getInfinite
}

export default tagRouter;



