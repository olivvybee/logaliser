import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { getDB } from '@/db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createActivity, createActivitySchema } from './createActivity';
import { coasterActivityHandler } from './coaster';

export const activitiesHandler = new Hono();

activitiesHandler.route('/coaster', coasterActivityHandler);

activitiesHandler.post(
  '/',
  zValidator('json', createActivitySchema),
  async (ctx) => {
    try {
      const db = getDB();
      const result = await createActivity(ctx.req.valid('json'), db);
      return ctx.json(result);
    } catch (err) {
      const typedErr = err as PrismaClientKnownRequestError;
      return ctx.json(
        { error: { ...typedErr, message: typedErr.message } },
        400
      );
    }
  }
);
