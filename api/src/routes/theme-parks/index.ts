import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { dbMiddleware } from '../../middleware/dbMiddleware';
import { importThemeParks, importThemeParksSchema } from './importThemeParks';

export const themeParksHandler = new Hono();

themeParksHandler.post(
  '/import',
  zValidator('json', importThemeParksSchema),
  dbMiddleware,
  async (ctx) => {
    const db = ctx.get('db');
    const input = ctx.req.valid('json');
    const result = await importThemeParks(input, db);
    return ctx.json(result);
  }
);
