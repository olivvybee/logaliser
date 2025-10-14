import { Station, TrainActivity } from '@logaliser/api';
import { makeRequest } from './makeRequest';

export const startTrainActivity = async (
  stationId: number,
  timestamp: string = new Date().toISOString()
) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const body = {
    origin: stationId,
    departureTime: timestamp,
    timezone,
  };

  return makeRequest<TrainActivity>('/activities/train/start', { body });
};

export const completeTrainActivity = async (
  activityId: number,
  stationId: number,
  timestamp: string = new Date().toISOString()
) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const body = {
    id: activityId,
    destination: stationId,
    arrivalTime: timestamp,
    timezone,
  };

  return makeRequest<TrainActivity>('/activities/train/complete', { body });
};

export const getNearbyStations = async (
  latitude: number,
  longitude: number
) => {
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
  });

  const path = `/stations/nearby?${params.toString()}`;

  return makeRequest<Station[]>(path);
};

export const getCountryList = async () => {
  return makeRequest<string[]>('/stations/countries');
};

export const searchForStations = async (query: string, country?: string) => {
  const params = new URLSearchParams({
    query,
  });
  if (country) {
    params.set('country', country);
  }

  const path = `/stations/search?${params.toString()}`;

  return makeRequest<Station[]>(path);
};
