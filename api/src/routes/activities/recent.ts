import { Hono } from 'hono';
import { sub, startOfDay } from 'date-fns';
import _groupBy from 'lodash/groupBy';
import _orderBy from 'lodash/orderBy';

import { getDB } from '../../db';

export const recentActivityHandler = new Hono();

recentActivityHandler.get('/', async (ctx) => {
  const db = getDB();

  const startOfToday = startOfDay(new Date());
  const sevenDaysAgo = sub(startOfToday, { days: 7 });

  const recentActivities = await db.activity.findMany({
    where: {
      timestamp: {
        gte: sevenDaysAgo,
      },
    },
  });

  const sortedActivities = _orderBy(recentActivities, ['timestamp'], ['desc']);

  const activitiesByDay = _groupBy(sortedActivities, (activity) =>
    activity.timestamp.toISOString().slice(0, 10)
  );

  return ctx.json(activitiesByDay);
});
