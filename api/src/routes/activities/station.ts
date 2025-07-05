import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware } from '../../middleware/authMiddleware';
import { zValidator } from '@hono/zod-validator';
import { getDB } from '../../db';

export const trainActivityHandler = new Hono();

const startTrainActivitySchema = z.object({
  origin: z.number().int(),
  departureTime: z.string().datetime({ local: true, offset: true }).optional(),
  timezone: z.string().optional(),
});

trainActivityHandler.post(
  '/start',
  authMiddleware,
  zValidator('json', startTrainActivitySchema),
  async (ctx) => {
    const db = getDB();

    const {
      origin,
      departureTime: overriddenTime,
      timezone = 'Europe/London',
    } = ctx.req.valid('json');

    const station = await db.station.findUnique({
      where: { id: origin },
    });
    if (!station) {
      return ctx.json({ error: `Station with id ${origin} not found` }, 400);
    }

    const departureTimestamp = overriddenTime
      ? new Date(overriddenTime)
      : new Date();

    const activity = await db.trainActivity.create({
      data: {
        activity: {
          create: {
            timestamp: departureTimestamp,
            timezone,
          },
        },
        origin: { connect: { id: origin } },
        departureTime: departureTimestamp,
        departureTimezone: timezone,
      },
    });

    return ctx.json(activity);
  }
);

const completeTrainActivitySchema = z.object({
  id: z.number().int(),
  destination: z.number().int(),
  arrivalTime: z.string().datetime({ local: true, offset: true }).optional(),
  timezone: z.string().optional(),
});

trainActivityHandler.post(
  '/complete',
  authMiddleware,
  zValidator('json', completeTrainActivitySchema),
  async (ctx) => {
    const db = getDB();

    const {
      id,
      destination,
      arrivalTime: overriddenTime,
      timezone = 'Europe/London',
    } = ctx.req.valid('json');

    const activity = await db.trainActivity.findUnique({ where: { id } });
    if (!activity) {
      return ctx.json({ error: `Activity with id ${id} not found` }, 400);
    }

    const station = await db.station.findUnique({
      where: { id: destination },
    });
    if (!station) {
      return ctx.json({ error: `Station with id ${origin} not found` }, 400);
    }

    const arrivalTimestamp = overriddenTime
      ? new Date(overriddenTime)
      : new Date();

    const updatedActivity = await db.trainActivity.update({
      where: { id },
      data: {
        destination: { connect: { id: destination } },
        arrivalTime: arrivalTimestamp,
        arrivalTimezone: timezone,
      },
    });

    return ctx.json(updatedActivity);
  }
);
