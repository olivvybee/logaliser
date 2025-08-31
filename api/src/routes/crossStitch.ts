import { Hono } from 'hono';
import { getDB } from '../db';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

export const crossStitchHandler = new Hono();

crossStitchHandler.get('/', async (ctx) => {
  const db = getDB();

  const crossStitches = await db.crossStitch.findMany();

  return ctx.json(crossStitches);
});

crossStitchHandler.get('/active', async (ctx) => {
  const db = getDB();

  const crossStitches = await db.crossStitch.findMany({
    where: {
      endDate: null,
    },
  });

  return ctx.json(crossStitches);
});

const crossStitchSchema = z.object({
  name: z.string(),
  pattern: z.string().optional(),
  stitchCount: z.number().int().optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
});

crossStitchHandler.post(
  '/',
  zValidator('json', crossStitchSchema),
  async (ctx) => {
    const db = getDB();
    const input = ctx.req.valid('json');

    const crossStitch = await db.crossStitch.create({
      data: input,
    });

    return ctx.json(crossStitch);
  }
);
