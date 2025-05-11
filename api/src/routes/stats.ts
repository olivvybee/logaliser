import { zValidator } from '@hono/zod-validator';
import { endOfDay, startOfDay } from 'date-fns';
import { Hono } from 'hono';
import { z } from 'zod';

import { getDB } from '../db';
import { calculateCoasterStats } from '../stats/coasters';
import { ConcreteCoasterActivity } from '../db/types';

export const statsHandler = new Hono();

const statsSchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
});

statsHandler.get('/coaster', zValidator('query', statsSchema), async (ctx) => {
  const input = ctx.req.valid('query');
  const db = getDB();

  const startDate = startOfDay(input.startDate);
  const endDate = endOfDay(input.endDate);

  const activities = (await db.activity.findMany({
    where: {
      coasterActivity: {
        isNot: null,
      },
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: { coasterActivity: { include: { coaster: true } } },
  })) as ConcreteCoasterActivity[];

  const stats = calculateCoasterStats(activities, startDate, endDate);

  return ctx.json(stats);
});
