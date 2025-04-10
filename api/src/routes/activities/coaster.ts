import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { subSeconds } from 'date-fns';
import { ActivityType } from '@prisma/client';

import { getDB } from '../../db';
import { authMiddleware } from '../../middleware/authMiddleware';

export const coasterActivityHandler = new Hono();

const coasterActivitySchema = z.object({
  coasterId: z.number().int(),
  timestamp: z.string().datetime({ local: true, offset: true }).optional(),
  timezoneOffset: z.number().int().optional(),
  inShowExit: z.boolean().optional().default(false),
});

coasterActivityHandler.post(
  '/',
  authMiddleware,
  zValidator('json', coasterActivitySchema),
  async (ctx) => {
    const { coasterId, timestamp, timezoneOffset, inShowExit } =
      ctx.req.valid('json');
    const db = getDB();

    const coaster = await db.coaster.findUnique({ where: { id: coasterId } });
    if (!coaster) {
      return ctx.json({ error: `Coaster with id ${coasterId} not found` }, 400);
    }

    const endDate = timestamp ? new Date(timestamp) : new Date();
    const startDate = coaster.duration
      ? subSeconds(endDate, coaster.duration)
      : undefined;

    const activity = await db.activity.create({
      data: {
        type: ActivityType.Coaster,
        item: coasterId,
        startDate,
        endDate,
        timezoneOffset,
        metadata: {
          firstRide: !coaster.ridden,
          inShowExit,
        },
      },
    });

    if (!coaster.ridden) {
      await db.coaster.update({
        where: {
          id: coasterId,
        },
        data: {
          ridden: true,
          riddenDate: endDate,
        },
      });
    }

    return ctx.json(activity);
  }
);
