import { PrismaClient } from '../__generated__/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

export const getDB = () => {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL,
  });

  return new PrismaClient({ adapter }).$extends({
    query: {
      activity: {
        $allOperations: ({ model, query, args }) => {
          return query({
            ...args,
            include: {
              coasterActivity: {
                include: { coaster: { include: { park: true } } },
              },
              trainActivity: {
                include: { origin: true, destination: true },
              },
              crossStitchActivity: {
                include: { crossStitch: true },
              },
            },
          });
        },
      },
    },
  });
};
