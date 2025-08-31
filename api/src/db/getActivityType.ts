import { AnyActivity } from '../..';
import { ActivityType } from './types';

export const getActivityType = (activity: AnyActivity): ActivityType => {
  if (activity.coasterActivity) {
    return ActivityType.Coaster;
  }

  if (activity.trainActivity) {
    return ActivityType.Train;
  }

  if (activity.crossStitchActivity) {
    return ActivityType.CrossStitch;
  }

  return ActivityType.Unknown;
};
