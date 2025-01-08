import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

export const updateCoastersSchema = z.array(
  z.object({
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
  })
);

type UpdateCoastersInput = z.infer<typeof updateCoastersSchema>;

export const updateCoasters = async (
  input: UpdateCoastersInput,
  db: PrismaClient
) => {
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

  return {
    successfulUpdates,
    failedUpdates,
  };
};
