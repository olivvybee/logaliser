import { makeRequest } from '../makeRequest';
import { CoasterStats } from '@logaliser/api';
import { getApiKey } from './getApiKey';

export const getCoasterStats = async (startDate: Date, endDate: Date) => {
  const apiKey = getApiKey();

  const params = new URLSearchParams({
    type: 'Coaster',
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  });

  const path = `/stats?${params.toString()}`;

  return makeRequest<CoasterStats>(path, apiKey);
};
