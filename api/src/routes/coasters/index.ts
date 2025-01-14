import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { getDB } from '@/db';
import { importCoasters, importCoastersSchema } from './importCoasters';

export const coastersHandler = new Hono();

coastersHandler.post(
  '/import',
  zValidator('json', importCoastersSchema),
  async (ctx) => {
    const db = getDB();
    const input = ctx.req.valid('json');
    const result = await importCoasters(input, db);
    return ctx.json(result);
  }
);
