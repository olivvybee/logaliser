import { getDB } from '@/db';
import { extendActivities } from '@/db/extendActivities';
import { calculateStats } from '@/stats/calculateStats';
import { zValidator } from '@hono/zod-validator';
import { ActivityType } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';
import { Hono } from 'hono';
import { z } from 'zod';

export const statsHandler = new Hono();

const statsSchema = z.object({
  type: z.nativeEnum(ActivityType),
  startDate: z.string().date(),
  endDate: z.string().date(),
});

statsHandler.get('/', zValidator('query', statsSchema), async (ctx) => {
  const input = ctx.req.valid('query');
  const db = getDB();

  const startDate = startOfDay(input.startDate);
  const endDate = endOfDay(input.endDate);

  const activities = await db.activity.findMany({
    where: {
      type: input.type,
      endDate: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const extendedActivities = await extendActivities(activities);

  const stats = calculateStats(
    extendedActivities,
    input.type,
    startDate,
    endDate
  );

  return ctx.json(stats);
});
