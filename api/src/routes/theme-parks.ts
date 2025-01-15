import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { getDB } from '@/db';

export const themeParksHandler = new Hono();

themeParksHandler.get(
  '/search',
  zValidator(
    'query',
    z.object({
      query: z.string(),
    })
  ),
  async (ctx) => {
    const db = getDB();
    const { query } = ctx.req.valid('query');

    const parks = await db.themePark.findMany({
      where: {
        name: { contains: query },
      },
      orderBy: { name: 'asc' },
      include: { coasters: true },
    });

    return ctx.json(parks);
  }
);

export const themeParkSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  country: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

themeParksHandler.post(
  '/import',
  zValidator('json', z.array(themeParkSchema)),
  async (ctx) => {
    const db = getDB();
    const input = ctx.req.valid('json');

    const successfulUpdates = [];
    const failedUpdates = [];

    for (let park of input) {
      try {
        const result = await db.themePark.upsert({
          where: {
            id: park.id,
          },
          update: {
            ...park,
          },
          create: {
            ...park,
          },
        });

        successfulUpdates.push(result);
      } catch (err) {
        const error = err as Error;
        failedUpdates.push({ park, error });
      }
    }

    return ctx.json({ successfulUpdates, failedUpdates });
  }
);
