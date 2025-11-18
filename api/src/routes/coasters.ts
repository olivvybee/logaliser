import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import _uniq from 'lodash/uniq';

import { getDB } from '../db';
import { getDistance } from '../utils/distance';
import { authMiddleware } from '../middleware/authMiddleware';
import { locationSchema } from '../schemas/locationSchema';
import { getNearbyLatLong } from '../utils/nearbyLatLong';

export const coastersHandler = new Hono();

coastersHandler.get(
  '/nearby',
  zValidator('query', locationSchema),
  async (ctx) => {
    const db = getDB();
    const { lat, lng } = ctx.req.valid('query');

    const nearbyLatLong = getNearbyLatLong(lat, lng);

    const coasters = await db.coaster.findMany({
      where: {
        park: {
          latitude: {
            gte: nearbyLatLong.latitude.min,
            lte: nearbyLatLong.latitude.max,
          },
          longitude: {
            gte: nearbyLatLong.longitude.min,
            lte: nearbyLatLong.longitude.max,
          },
        },
        closed: false,
      },
      include: {
        park: {
          select: {
            name: true,
          },
        },
      },
    });

    const coastersWithDistance = coasters.map((coaster) => ({
      ...coaster,
      distance:
        coaster.latitude && coaster.longitude
          ? getDistance(lat, lng, coaster.latitude, coaster.longitude)
          : undefined,
    }));

    coastersWithDistance.sort((a, b) => {
      if (!b.distance) {
        return -1;
      }
      if (!a.distance) {
        return 1;
      }
      return a.distance - b.distance;
    });

    return ctx.json(coastersWithDistance);
  }
);

const searchSchema = z.object({
  query: z.string(),
  country: z.string().optional(),
});

coastersHandler.get(
  '/search',
  zValidator('query', searchSchema),
  async (ctx) => {
    const db = getDB();
    const { query, country } = ctx.req.valid('query');

    const coasters = await db.coaster.findMany({
      where: {
        name: { contains: query },
        park: {
          country: { equals: country },
        },
        closed: false,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        park: {
          select: {
            name: true,
          },
        },
      },
    });

    return ctx.json(coasters);
  }
);

const coasterSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  parkId: z.number().int(),
  opened: z.string().optional().nullable(),
  make: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  design: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  length: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  speed: z.number().optional().nullable(),
  inversions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  verticalAngle: z.number().optional().nullable(),
  drop: z.number().optional().nullable(),
});

coastersHandler.get('/ridden', async (ctx) => {
  const db = getDB();

  const riddenCoasters = await db.coaster.findMany({
    where: {
      ridden: true,
    },
  });

  const parkIds = riddenCoasters.map((coaster) => coaster.parkId);

  const parks = await db.themePark.findMany({
    where: {
      id: {
        in: parkIds,
      },
    },
    include: {
      coasters: true,
    },
  });

  return ctx.json(parks);
});

coastersHandler.post(
  '/import',
  authMiddleware,
  zValidator('json', z.array(coasterSchema)),
  async (ctx) => {
    const db = getDB();
    const input = ctx.req.valid('json');

    const successfulUpdates = [];
    const failedUpdates = [];

    for (let coaster of input) {
      try {
        const result = await db.coaster.upsert({
          where: {
            id: coaster.id,
          },
          update: {
            ...coaster,
          },
          create: {
            ...coaster,
          },
        });

        successfulUpdates.push(result);
      } catch (err) {
        const error = err as Error;
        failedUpdates.push({ data: coaster, error });
      }
    }

    return ctx.json({ successfulUpdates, failedUpdates });
  }
);
