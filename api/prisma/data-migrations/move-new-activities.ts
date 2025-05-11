import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const run = async () => {
  await prisma.$transaction(async (tx) => {
    const activities = await tx.newCoasterActivity.findMany({
      include: {
        activity: true,
      },
    });

    for (const activity of activities) {
      await tx.coasterActivity.create({
        data: {
          activity: {
            create: {
              timestamp: activity.activity.timestamp,
              timezone: activity.activity.timezone,
            },
          },
          coaster: { connect: { id: activity.coasterId } },

          firstRide: activity.firstRide,
          inShowExit: activity.inShowExit,
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
