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
  const updatedRecords = [];

  for (let park of input) {
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

    updatedRecords.push(result);
  }

  return updatedRecords;
};
