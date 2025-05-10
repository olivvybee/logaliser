import { ActivityType, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const run = async () => {
  await prisma.$transaction(async (tx) => {
    const activities = await tx.activity.findMany({
      where: {
        type: {
          equals: ActivityType.Coaster,
        },
      },
    });

    for (const activity of activities) {
      const metadata = activity.metadata as Prisma.JsonObject;

      await tx.coasterActivity.create({
        data: {
          coaster: { connect: { id: activity.item } },
          date: activity.endDate,
          timezoneOffset: activity.timezoneOffset,
          firstRide: !!metadata.firstRide,
          inShowExit: !!metadata.inShowExit,
        },
      });
    }
  });
};

run()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
