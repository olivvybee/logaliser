import { PrismaClient } from '@prisma/client';

export const getDB = () => {
  return new PrismaClient().$extends({
    query: {
      activity: {
        $allOperations: ({ model, query, args }) => {
          return query({
            ...args,
            include: {
              coasterActivity: {
                include: { coaster: { include: { park: true } } },
              },
            },
          });
        },
      },
    },
  });
};
