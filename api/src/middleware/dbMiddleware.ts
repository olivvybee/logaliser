import { PrismaClient } from '@prisma/client';
import { createMiddleware } from 'hono/factory';

export const dbMiddleware = createMiddleware<{
  Variables: {
    db: PrismaClient;
  };
}>(async (ctx, next) => {
  const db = new PrismaClient();
  ctx.set('db', db);
  await next();
});
