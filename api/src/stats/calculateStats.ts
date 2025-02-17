import { CoasterActivity, ExtendedActivity } from '@/db/types';
import { ActivityType } from '@prisma/client';
import { calculateCoasterStats } from './coasterStats';

export const calculateStats = (
  activities: ExtendedActivity[],
  type: ActivityType
) => {
  switch (type) {
    case ActivityType.Coaster:
      return calculateCoasterStats(activities as CoasterActivity[]);
  }
};
