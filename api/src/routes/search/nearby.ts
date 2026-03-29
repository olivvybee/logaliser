import { z } from 'zod';
import { HTTPException } from 'hono/http-exception';

import { getDB } from '../../db';
import { ActivityType } from '../../db/types';
import { getNearbyLatLong } from '../../utils/nearbyLatLong';
import { getDistance } from '../../utils/distance';

export const nearbySchema = z.object({
  activityType: z.enum(ActivityType),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export const searchNearby = async (
  activityType: ActivityType,
  latitude: number,
  longitude: number
) => {
  const results = await getNearbyResults(activityType, latitude, longitude);
  if (!results) {
    throw new HTTPException(422, {
      message: `Location search not applicable for ${activityType} activity type`,
    });
  }

  const resultsWithDistance = results
    .flatMap((result) =>
      result.latitude && result.longitude
        ? [
            {
              ...result,
              distance: getDistance(
                latitude,
                longitude,
                result.latitude,
                result.longitude
              ),
            },
          ]
        : []
    )
    .toSorted((a, b) => {
      if (!a.distance) {
        return 1;
      }

      if (!b.distance) {
        return -1;
      }

      return a.distance - b.distance;
    });

  return resultsWithDistance;
};

const getNearbyResults = async (
  activityType: ActivityType,
  latitude: number,
  longitude: number
) => {
  const db = getDB();
  const boundingBox = getNearbyLatLong(latitude, longitude);

  const conditions = {
    latitude: {
      gte: boundingBox.latitude.min,
      lte: boundingBox.latitude.max,
    },
    longitude: {
      gte: boundingBox.longitude.min,
      lte: boundingBox.longitude.max,
    },
  };

  switch (activityType) {
    case ActivityType.Coaster:
      return db.coaster.findMany({
        where: conditions,
        include: {
          park: { select: { name: true } },
        },
      });

    case ActivityType.Train:
      return db.station.findMany({ where: conditions });

    default:
      return undefined;
  }
};
