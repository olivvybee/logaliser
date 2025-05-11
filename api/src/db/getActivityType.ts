import { AnyActivity } from '../..';
import { ActivityType } from './types';

export const getActivityType = (activity: AnyActivity): ActivityType => {
  if (activity.coasterActivity) {
    return ActivityType.Coaster;
  }

  return ActivityType.Unknown;
};
