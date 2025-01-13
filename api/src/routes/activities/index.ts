import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createActivity, createActivitySchema } from './createActivity';
import { dbMiddleware } from '@/src/middleware/dbMiddleware';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const activitiesHandler = new Hono();

activitiesHandler.post(
  '/',
  zValidator('json', createActivitySchema),
  dbMiddleware,
  async (ctx) => {
    try {
      const db = ctx.get('db');
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
