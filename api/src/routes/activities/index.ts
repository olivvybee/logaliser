import { Hono } from 'hono';

import { coasterActivityHandler } from './coaster';
import { recentActivityHandler } from './recent';
import { getDB } from '@/db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '@/middleware/authMiddleware';

export const activitiesHandler = new Hono();

activitiesHandler.route('/coaster', coasterActivityHandler);
activitiesHandler.route('/recent', recentActivityHandler);

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
