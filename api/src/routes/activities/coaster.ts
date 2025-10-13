import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { getDB } from '../../db';
import { authMiddleware } from '../../middleware/authMiddleware';

export const coasterActivityHandler = new Hono();

const coasterActivitySchema = z.object({
  coasterId: z.number().int(),
  timestamp: z.iso.datetime({ local: true, offset: true }).optional(),
  timezone: z.string().optional(),
  inShowExit: z.boolean().optional().default(false),
});

coasterActivityHandler.post(
  '/',
  authMiddleware,
  zValidator('json', coasterActivitySchema),
  async (ctx) => {
    const {
      coasterId,
      timestamp: overriddenTimestamp,
      timezone = 'Europe/London',
      inShowExit,
    } = ctx.req.valid('json');
    const db = getDB();

    const coaster = await db.coaster.findUnique({ where: { id: coasterId } });
    if (!coaster) {
      return ctx.json({ error: `Coaster with id ${coasterId} not found` }, 400);
    }

    const timestamp = overriddenTimestamp
      ? new Date(overriddenTimestamp)
      : new Date();

    const activity = await db.coasterActivity.create({
      data: {
        activity: { create: { timestamp, timezone } },
        coaster: { connect: { id: coasterId } },
        firstRide: !coaster.ridden,
        inShowExit,
      },
    });

    if (!coaster.ridden) {
      await db.coaster.update({
        where: {
          id: coasterId,
        },
        data: {
          ridden: true,
          riddenDate: timestamp,
        },
      });
    }

    return ctx.json(activity);
  }
);
