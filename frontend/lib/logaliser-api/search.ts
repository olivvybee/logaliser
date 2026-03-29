import { ActivityType } from '@logaliser/api';
import { makeRequest } from './makeRequest';
import { Entity } from '@/components/EntityChooser/EntityChooser.types';

export const searchNearby = async <TEntity extends Entity>(
  activityType: ActivityType,
  latitude: number,
  longitude: number
) => {
  const params = new URLSearchParams({
    activityType,
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });

  const path = `/search/nearby?${params.toString()}`;

  return makeRequest<TEntity[]>(path);
};
