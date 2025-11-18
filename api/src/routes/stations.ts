import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware } from '../middleware/authMiddleware';
import { zValidator } from '@hono/zod-validator';
import { getDB } from '../db';
import { locationSchema } from '../schemas/locationSchema';
import { getNearbyLatLong } from '../utils/nearbyLatLong';
import { getDistance } from '../utils/distance';

export const stationsHandler = new Hono();

export const stationSchema = z.object({
  id: z.number().int().optional(),
  nationalId: z.number().int().optional().nullable(),
  name: z.string(),
  country: z.string(),
  code: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
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
  '/nearby',
  zValidator('query', locationSchema),
  async (ctx) => {
    const db = getDB();
    const { lat, lng } = ctx.req.valid('query');

    const nearbyLatLong = getNearbyLatLong(lat, lng);

    const stations = await db.station.findMany({
      where: {
        latitude: {
          gte: nearbyLatLong.latitude.min,
          lte: nearbyLatLong.latitude.max,
        },
        longitude: {
          gte: nearbyLatLong.longitude.min,
          lte: nearbyLatLong.longitude.max,
        },
      },
    });

    const stationsWithDistance = stations.map((station) => ({
      ...station,
      distance:
        station.latitude && station.longitude
          ? getDistance(lat, lng, station.latitude, station.longitude)
          : undefined,
    }));

    const sortedStations = stationsWithDistance.toSorted((a, b) => {
      if (!b.distance) {
        return -1;
      }
      if (!a.distance) {
        return 1;
      }
      return a.distance - b.distance;
    });

    return ctx.json(sortedStations);
  }
);

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
