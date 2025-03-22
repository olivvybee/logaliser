import { makeRequest } from './makeRequest';
import { CoasterStats } from '@logaliser/api';

export const getCoasterStats = async (startDate: Date, endDate: Date) => {
  const params = new URLSearchParams({
    type: 'Coaster',
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  });

  const path = `/stats?${params.toString()}`;

  return makeRequest<CoasterStats>(path);
};
