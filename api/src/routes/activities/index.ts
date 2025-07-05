import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { z } from 'zod';

import { getDB } from '../../db';
import { authMiddleware } from '../../middleware/authMiddleware';

import { coasterActivityHandler } from './coaster';
import { recentActivityHandler } from './recent';
import { trainActivityHandler } from './station';

export const activitiesHandler = new Hono();

activitiesHandler.route('/coaster', coasterActivityHandler);
activitiesHandler.route('/train', trainActivityHandler);
activitiesHandler.route('/recent', recentActivityHandler);

const ACTIVITIES_PER_PAGE = 25;

activitiesHandler.get(
  '/',
  zValidator('query', z.object({ cursor: z.coerce.number().optional() })),
  async (ctx) => {
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

    return ctx.json({
      activities,
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
