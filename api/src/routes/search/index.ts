import { Hono } from 'hono';
import { nearbySchema, searchNearby } from './nearby';
import { zValidator } from '@hono/zod-validator';

export const searchHandler = new Hono();

searchHandler.get('/nearby', zValidator('query', nearbySchema), async (ctx) => {
  const { activityType, latitude, longitude } = ctx.req.valid('query');
  return ctx.json(await searchNearby(activityType, latitude, longitude));
});
