'use client';

import { makeRequest } from '../makeRequest';
import { getApiKey } from './getApiKey';

export const deleteActivity = (activityId: number) => {
  const apiKey = getApiKey();

  return makeRequest(`/activities/delete/${activityId}`, apiKey);
};
