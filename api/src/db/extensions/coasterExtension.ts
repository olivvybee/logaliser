import { Activity, Prisma } from '@prisma/client';
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
      park: true,
    },
  });

  return activities
    .map((activity) => {
      const coaster = coasters.find((coaster) => coaster.id === activity.item);
      if (!coaster) {
        return undefined;
      }

      const metadata = activity.metadata as Prisma.JsonObject;

      return {
        ...activity,
        type: 'Coaster' as const,
        coaster,
        metadata: {
          firstRide: !!metadata.firstRide,
          inShowExit: !!metadata.inShowExit,
        },
      };
    })
    .filter((coaster) => coaster !== undefined);
};
