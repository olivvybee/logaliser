import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware } from '../middleware/authMiddleware';
import { zValidator } from '@hono/zod-validator';
import { getDB } from '../db';

export const stationsHandler = new Hono();

export const stationSchema = z.object({
  id: z.number().int().optional(),
  nationalId: z.number().int().optional(),
  name: z.string(),
  country: z.string(),
  code: z.string().optional(),
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

const searchSchema = z.object({
  query: z.string(),
  country: z.string().optional(),
});

stationsHandler.get(
  '/search',
  zValidator('query', searchSchema),
  async (ctx) => {
    const db = getDB();
    const { query, country } = ctx.req.valid('query');

    const stations = await db.station.findMany({
      where: {
        name: { contains: query },
        country: { equals: country },
      },
      orderBy: { name: 'asc' },
    });

    return ctx.json(stations);
  }
);

stationsHandler.get('/countries', async (ctx) => {
  const db = getDB();

  const countryObjects = await db.station.findMany({
    distinct: ['country'],
    select: { country: true },
    orderBy: { country: 'asc' },
  });

  const countries = countryObjects.map((obj) => obj.country);

  return ctx.json(countries);
});

stationsHandler.post(
  '/import',
  authMiddleware,
  zValidator('json', z.array(stationSchema)),
  async (ctx) => {
    const db = getDB();
    const input = ctx.req.valid('json');

    const successfulUpdates = [];
    const failedUpdates = [];

    for (let station of input) {
      try {
        const result = station.nationalId
          ? await db.station.upsert({
              where: {
                nationalId: station.nationalId,
              },
              update: {
                ...station,
              },
              create: {
                ...station,
              },
            })
          : await db.station.create({
              data: {
                ...station,
              },
            });

        successfulUpdates.push(result);
      } catch (err) {
        const error = err as Error;
        failedUpdates.push({ data: station, error });
      }
    }

    return ctx.json({ successfulUpdates, failedUpdates });
  }
);
