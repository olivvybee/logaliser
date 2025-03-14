import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { subSeconds } from 'date-fns';

import { getDB } from '@/db';
import { ActivityType } from '@prisma/client';
import { authMiddleware } from '@/middleware/authMiddleware';

export const coasterActivityHandler = new Hono();

const coasterActivitySchema = z.object({
  coasterId: z.number().int(),
  timestamp: z.string().datetime({ local: true }).optional(),
  firstRide: z.boolean().optional(),
});

coasterActivityHandler.post(
  '/',
  authMiddleware,
  zValidator('json', coasterActivitySchema),
  async (ctx) => {
    const { coasterId, timestamp, firstRide } = ctx.req.valid('json');
    const db = getDB();

    const coaster = await db.coaster.findUnique({ where: { id: coasterId } });
    if (!coaster) {
      return ctx.json({ error: `Coaster with id ${coasterId} not found` }, 400);
    }

    const endDate = timestamp ? new Date(timestamp) : new Date();
    const startDate = subSeconds(endDate, coaster.duration || 0);

    const activity = await db.activity.create({
      data: {
        type: ActivityType.Coaster,
        item: coasterId,
        startDate,
        endDate,
        metadata: {
          firstRide,
        },
      },
    });

    return ctx.json(activity);
  }
);
