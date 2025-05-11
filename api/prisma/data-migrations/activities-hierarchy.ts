import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const run = async () => {
  await prisma.$transaction(async (tx) => {
    const activities = await tx.coasterActivity.findMany();

    for (const activity of activities) {
      await tx.newCoasterActivity.create({
        data: {
          activity: {
            create: {
              timestamp: activity.date,
              timezone: activity.timezoneOffset
                ? 'Europe/Paris'
                : 'Europe/London',
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
