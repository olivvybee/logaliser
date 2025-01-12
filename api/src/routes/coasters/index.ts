import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { dbMiddleware } from '@/src/middleware/dbMiddleware';
import { importCoasters, importCoastersSchema } from './importCoasters';

export const coastersHandler = new Hono();

coastersHandler.post(
  '/import',
  zValidator('json', importCoastersSchema),
  dbMiddleware,
  async (ctx) => {
    const db = ctx.get('db');
    const input = ctx.req.valid('json');
    const result = await importCoasters(input, db);
    return ctx.json(result);
  }
);
