import { Context } from 'hono';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

export const getDB = (ctx: Context<{ Bindings: Env }>) => {
  const adapter = new PrismaD1(ctx.env.DB);
  return new PrismaClient({ adapter });
};
