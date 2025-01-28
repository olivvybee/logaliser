import { makeRequest } from '../makeRequest';
import { getClientSideCookie } from './getClientSideCookie';

export const deleteActivity = (activityId: number) => {
  const apiKey = getClientSideCookie();

  return makeRequest(`/activities/delete/${activityId}`, apiKey);
};
