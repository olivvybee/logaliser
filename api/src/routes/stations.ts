import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware } from '../middleware/authMiddleware';
import { zValidator } from '@hono/zod-validator';
import { getDB } from '../db';

export const stationsHandler = new Hono();

export const stationSchema = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  country: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

stationsHandler.post(
  '/',
  authMiddleware,
  zValidator('json', stationSchema),
  async (ctx) => {
    const db = getDB();
    const input = ctx.req.valid('json');

    const { id, ...data } = input;

    if (id) {
      const result = await db.station.update({ where: { id }, data });
      return ctx.json(result);
    }

    const result = await db.station.create({ data });
    return ctx.json(result);
  }
);
