import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { getDB } from '@/db';

export const coastersHandler = new Hono();

const coasterSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  parkId: z.number().int(),
  opened: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  type: z.string().optional(),
  design: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  length: z.number().optional(),
  height: z.number().optional(),
  speed: z.number().optional(),
  inversions: z.number().int().optional(),
  duration: z.number().optional(),
  verticalAngle: z.number().optional(),
  drop: z.number().optional(),
});

coastersHandler.post(
  '/import',
  zValidator('json', z.array(coasterSchema)),
  async (ctx) => {
    const db = getDB();
    const input = ctx.req.valid('json');

    const successfulUpdates = [];
    const failedUpdates = [];

    for (let coaster of input) {
      try {
        const result = await db.coaster.upsert({
          where: {
            id: coaster.id,
          },
          update: {
            ...coaster,
          },
          create: {
            ...coaster,
          },
        });

        successfulUpdates.push(result);
      } catch (err) {
        const error = err as Error;
        failedUpdates.push({ data: coaster, error });
      }
    }

    return ctx.json({ successfulUpdates, failedUpdates });
  }
);
