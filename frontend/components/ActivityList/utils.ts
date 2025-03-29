import { format, formatDistanceToNowStrict, isToday } from 'date-fns';

import { Activity, ActivityType, CoasterActivity } from '@logaliser/api';
import { IconRollercoasterFilled } from '@tabler/icons-react';
import { CoasterCard } from './cards/CoasterCard';
import { CardComponentProps } from './types';

export const getCardComponent = (
  activityType: ActivityType
): React.ComponentType<CardComponentProps> => {
  switch (activityType) {
    case 'Coaster':
      return CoasterCard;
  }
};

export const getIcon = (activityType: ActivityType) => {
  switch (activityType) {
    case 'Coaster':
      return IconRollercoasterFilled;
  }
};

const formatTimestamp = (date: string | Date) => {
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
    case 'Coaster':
      return {
        timestamp: formatTimestamp(activity.endDate),
        title: (activity as CoasterActivity).coaster.name,
        metadata: (activity as CoasterActivity).coaster.park.name,
      };
  }
};
