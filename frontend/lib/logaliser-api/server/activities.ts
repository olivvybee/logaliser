import { makeRequest } from '../makeRequest';
import { Activity } from '../types';
import { getApiKey } from './getApiKey';

type RecentActivitiesResponse = {
  [date: string]: Activity[];
};

export const getRecentActivities = async () => {
  const apiKey = await getApiKey();

  return makeRequest<RecentActivitiesResponse>('/activities/recent', apiKey);
};
