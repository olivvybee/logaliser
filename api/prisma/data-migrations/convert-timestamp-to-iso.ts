import { getDB } from '../../src/db';
import { config as loadEnv } from 'dotenv';

loadEnv();
const db = getDB();

const run = async () => {
  await db.$transaction(async (tx) => {
    const activities = await tx.activity.findMany();

    for (const activity of activities) {
      const isoDate = new Date(activity.timestamp);
      await tx.activity.update({
        where: {
          id: activity.id,
        },
        data: {
          timestamp: isoDate,
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
    await db.$disconnect();
  });
