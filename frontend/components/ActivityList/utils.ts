import { format, formatDistanceToNowStrict, isToday } from 'date-fns';

import { Activity, ActivityType } from '@/lib/logaliser-api/types';
import { IconRollercoasterFilled } from '@tabler/icons-react';

export const getIcon = (activityType: ActivityType) => {
  switch (activityType) {
    case ActivityType.Coaster:
      return IconRollercoasterFilled;
  }
};

const formatTimestamp = (date: string) => {
  if (isToday(date)) {
    return formatDistanceToNowStrict(date, { addSuffix: true });
  }

  return format(date, 'HH:mm');
};

export interface ActivityDetails {
  timestamp: string;
  title: string;
  metadata?: string;
}

export const getDetails = (activity: Activity): ActivityDetails => {
  switch (activity.type) {
    case ActivityType.Coaster:
      return {
        timestamp: formatTimestamp(activity.endDate),
        title: activity.coaster.name,
        metadata: activity.coaster.park.name,
      };

    case ActivityType.Hidden:
      return {
        timestamp: formatTimestamp(activity.endDate),
        title: '',
        metadata: '',
      };
  }
};
