import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { getDB } from '@/db';
import { importThemeParks, importThemeParksSchema } from './importThemeParks';

export const themeParksHandler = new Hono();

themeParksHandler.post(
  '/import',
  zValidator('json', importThemeParksSchema),
  async (ctx) => {
    const db = getDB();
    const input = ctx.req.valid('json');
    const result = await importThemeParks(input, db);
    return ctx.json(result);
  }
);
