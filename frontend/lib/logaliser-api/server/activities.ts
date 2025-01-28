import { makeRequest } from '../makeRequest';
import { Activity } from '../types';
import { getServerSideCookie } from './getServerSideCookie';

type RecentActivitiesResponse = {
  [date: string]: Activity[];
};

export const getRecentActivities = async () => {
  const apiKey = await getServerSideCookie();

  return makeRequest<RecentActivitiesResponse>('/activities/recent', apiKey);
};
