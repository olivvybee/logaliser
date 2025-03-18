import { Activity, ActivityType } from '@prisma/client';
import _uniq from 'lodash/uniq';
import _groupBy from 'lodash/groupBy';
import { ExtendedActivity, ExtensionFn } from './types';
import { extendCoasterActivities } from './extensions/coasterExtension';

const EXTENSION_MAP: Record<ActivityType, ExtensionFn> = {
  [ActivityType.Coaster]: extendCoasterActivities,
  [ActivityType.Hidden]: async (activities) => activities,
};

export const extendActivities = async (activities: Activity[]) => {
  const activitiesByType = _groupBy(activities, 'type');

  return Object.entries(activitiesByType).reduce(
    async (processed, [type, activitiesGroup]) => {
      const processedActivities = await processed;
      const extensionFn = EXTENSION_MAP[type as ActivityType];
      const extendedActivities = await extensionFn(activitiesGroup);
      return [...processedActivities, ...extendedActivities];
    },
    Promise.resolve([] as ExtendedActivity[])
  );
};
