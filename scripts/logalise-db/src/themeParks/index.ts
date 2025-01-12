import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { updateThemeParks, updateThemeParksSchema } from './updateThemeParks';
import { getDB } from '../getDB';

export const themeParksHandler = new Hono<{ Bindings: Env }>();

themeParksHandler.post(
  '/update',
  zValidator('json', updateThemeParksSchema),
  async (ctx) => {
    const db = getDB(ctx);
    const input = ctx.req.valid('json');
    const result = await updateThemeParks(input, db);
    return ctx.json(result);
  }
);
