import { ActivityType, PrismaClient } from '@prisma/client';
import { z } from 'zod';

const baseActivitySchema = z.object({
  startDate: z.string().datetime({ local: true }).optional(),
  endDate: z.string().datetime({ local: true }),
  itemId: z.number().int(),
});

export const createActivitySchema = z.discriminatedUnion('type', [
  baseActivitySchema.extend({
    type: z.literal(ActivityType.Coaster),
  }),
]);

type CreateActivityInput = z.infer<typeof createActivitySchema>;

const getReferencedTable = (activityType: ActivityType, db: PrismaClient) => {
  switch (activityType) {
    case ActivityType.Coaster:
      return db.coaster;
  }
};

export const createActivity = async (
  input: CreateActivityInput,
  db: PrismaClient
) => {
  const {
    type,
    itemId,
    startDate: startDateIso,
    endDate: endDateIso,
    ...metadata
  } = input;

  const referencedTable = getReferencedTable(type, db);
  const referencedItem = await referencedTable.findUniqueOrThrow({
    where: { id: itemId },
  });

  const endDate = new Date(endDateIso);
  const startDate = startDateIso ? new Date(startDateIso) : endDate;

  return db.activity.create({
    data: {
      type,
      startDate,
      endDate,
      item: referencedItem.id,
      metadata,
    },
  });
};
