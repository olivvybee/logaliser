import { Activity, ActivityType } from '@prisma/client';
import { isBefore, startOfDay, subDays } from 'date-fns';

export const obfuscateActivities = (activities: Activity[]): Activity[] => {
  const startOfToday = startOfDay(new Date());
  const startOfRange = subDays(startOfToday, 7);

  return activities.map((activity) => {
    if (isBefore(activity.endDate, startOfRange)) {
      return activity;
    }

    return {
      ...activity,
      type: ActivityType.Hidden,
      item: -1,
      metadata: {},
    };
  });
};
