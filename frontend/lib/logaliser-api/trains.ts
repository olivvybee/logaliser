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
