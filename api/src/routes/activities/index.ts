import { Hono } from 'hono';

import { coasterActivityHandler } from './coaster';
import { recentActivityHandler } from './recent';
import { getDB } from '@/db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '@/middleware/authMiddleware';
import { softAuthMiddleware } from '@/middleware/softAuthMiddleware';
import { extendActivities } from '@/db/extendActivities';
import { obfuscateActivities } from '@/db/obfuscateActivities';

export const activitiesHandler = new Hono();

activitiesHandler.route('/coaster', coasterActivityHandler);
activitiesHandler.route('/recent', recentActivityHandler);

const ACTIVITIES_PER_PAGE = 25;

activitiesHandler.get(
  '/',
  softAuthMiddleware,
  zValidator('query', z.object({ cursor: z.coerce.number().optional() })),
  async (ctx) => {
    const isAuthenticated = ctx.get('isAuthenticated');
    const { cursor } = ctx.req.valid('query');
    const db = getDB();

    const activities = await db.activity.findMany({
      take: ACTIVITIES_PER_PAGE,
      skip: cursor ? 1 : 0,
      orderBy: {
        id: 'desc',
      },
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
    });

    const nextCursor = activities.at(-1)?.id;

    const obfuscatedActivities = isAuthenticated
      ? activities
      : obfuscateActivities(activities);
    const extendedActivities = await extendActivities(obfuscatedActivities);

    return ctx.json({
      activities: extendedActivities,
      nextCursor,
    });
  }
);

activitiesHandler.post(
  '/delete/:id',
  authMiddleware,
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (ctx) => {
    const id = parseInt(ctx.req.param('id'));
    const db = getDB();

    try {
      await db.activity.delete({ where: { id } });
    } catch (err) {
      const typedError = err as PrismaClientKnownRequestError;
      if (typedError.code === 'P2025') {
        return ctx.notFound();
      } else {
        return ctx.json(typedError.message, 500);
      }
    }

    return ctx.json({});
  }
);
