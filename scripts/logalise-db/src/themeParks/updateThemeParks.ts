import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

export const updateThemeParksSchema = z.array(
  z.object({
    id: z.number().int(),
    name: z.string(),
    country: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })
);

type UpdateThemeParksInput = z.infer<typeof updateThemeParksSchema>;

export const updateThemeParks = async (
  input: UpdateThemeParksInput,
  db: PrismaClient
) => {
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

  return {
    successfulUpdates,
    failedUpdates,
  };
};
