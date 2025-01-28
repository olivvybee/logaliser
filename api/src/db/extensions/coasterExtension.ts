import { Activity } from '@prisma/client';
import _uniq from 'lodash/uniq';

import { getDB } from '../getDB';
import { ExtensionFn, CoasterActivity } from '../types';

export const extendCoasterActivities: ExtensionFn = async (
  activities: Activity[]
): Promise<CoasterActivity[]> => {
  const db = getDB();

  const coasterIds = _uniq(activities.map((activity) => activity.item));
  const coasters = await db.coaster.findMany({
    where: {
      id: {
        in: coasterIds,
      },
    },
    include: {
      park: {
        select: {
          name: true,
        },
      },
    },
  });

  return activities
    .map((activity) => {
      const coaster = coasters.find((coaster) => coaster.id === activity.item);
      if (!coaster) {
        return undefined;
      }

      return {
        ...activity,
        coaster,
      };
    })
    .filter((coaster) => coaster !== undefined);
};
