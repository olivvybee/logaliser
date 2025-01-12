import { serve } from '@hono/node-server';
import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

const app = new Hono();

app.use(logger());

app.get('/', async (ctx) => {
  const db = new PrismaClient();
  const count = await db.themePark.count();
  const item = await db.themePark.findUnique({ where: { id: 1 } });
  return ctx.json({ count, item });
});

serve(app, (info) => {
  console.log(`Server started at http://localhost:${info.port}`);
});
