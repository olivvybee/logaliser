import { CoasterActivity } from '@logaliser/api';
import { makeRequest } from '../makeRequest';
import { getApiKey } from './getApiKey';

type RecentActivitiesResponse = {
  [date: string]: CoasterActivity[];
};

export const getRecentActivities = async () => {
  const apiKey = await getApiKey();

  return makeRequest<RecentActivitiesResponse>('/activities/recent', apiKey);
};
