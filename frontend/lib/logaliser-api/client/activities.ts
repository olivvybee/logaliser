'use client';

import { makeRequest } from '../makeRequest';
import { Activity } from '@logaliser/api';
import { getApiKey } from './getApiKey';

interface GetAllActivitiesResponse {
  activities: Activity[];
  nextCursor?: number;
}

export const getAllActivities = (cursor?: number) => {
  const apiKey = getApiKey();

  const params = cursor
    ? new URLSearchParams({ cursor: cursor?.toString() })
    : '';

  return makeRequest<GetAllActivitiesResponse>(
    `/activities?${params.toString()}`,
    apiKey
  );
};

export const deleteActivity = (activityId: number) => {
  const apiKey = getApiKey();

  return makeRequest(`/activities/delete/${activityId}`, apiKey);
};
