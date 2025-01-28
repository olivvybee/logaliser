import { Hono } from 'hono';
import { sub, startOfDay } from 'date-fns';
import _groupBy from 'lodash/groupBy';

import { getDB } from '@/db';
import { extendActivities } from '@/db/extendActivities';

export const recentActivityHandler = new Hono();

recentActivityHandler.get('/', async (ctx) => {
  const db = getDB();

  const startOfToday = startOfDay(new Date());
  const sevenDaysAgo = sub(startOfToday, { days: 7 });

  const recentActivities = await db.activity.findMany({
    where: {
      endDate: {
        gte: sevenDaysAgo,
      },
    },
  });

  const extendedActivities = await extendActivities(recentActivities);

  const activitiesByDay = _groupBy(extendedActivities, (activity) =>
    activity.endDate.toISOString().slice(0, 10)
  );

  return ctx.json(activitiesByDay);
});
