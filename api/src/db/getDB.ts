import { PrismaClient } from '@prisma/client';

export const getDB = () => {
  return new PrismaClient();
};
