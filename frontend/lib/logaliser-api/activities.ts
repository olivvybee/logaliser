'use client';

import { makeRequest } from './makeRequest';
import { AnyActivity } from '@logaliser/api';

interface GetAllActivitiesResponse {
  activities: AnyActivity[];
  nextCursor?: number;
}

export const getAllActivities = (cursor?: number) => {
  const params = cursor
    ? new URLSearchParams({ cursor: cursor?.toString() })
    : '';

  return makeRequest<GetAllActivitiesResponse>(
    `/activities?${params.toString()}`
  );
};

interface RecentActivitiesResponse {
  [date: string]: AnyActivity[];
}

export const getRecentActivities = () => {
  return makeRequest<RecentActivitiesResponse>('/activities/recent');
};

export const deleteActivity = (activityId: number) => {
  return makeRequest(`/activities/delete/${activityId}`);
};
