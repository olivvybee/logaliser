import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { updateCoasters, updateCoastersSchema } from './updateCoasters';
import { getDB } from '../getDB';

export const coastersHandler = new Hono<{ Bindings: Env }>();

coastersHandler.post(
  '/update',
  zValidator('json', updateCoastersSchema),
  async (ctx) => {
    const db = getDB(ctx);
    const input = ctx.req.valid('json');
    const result = await updateCoasters(input, db);
    return ctx.json(result);
  }
);
