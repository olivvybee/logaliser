import { ActivityType } from '@prisma/client';

import { CoasterActivity, ExtendedActivity } from '../db/types';

import { calculateCoasterStats } from './coasters';

export const calculateStats = (
  activities: ExtendedActivity[],
  type: ActivityType,
  startDate: Date,
  endDate: Date
) => {
  switch (type) {
    case ActivityType.Coaster:
      return calculateCoasterStats(
        activities as CoasterActivity[],
        startDate,
        endDate
      );
  }
};
