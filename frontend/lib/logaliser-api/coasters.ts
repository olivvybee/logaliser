'use client';

import { makeRequest } from './makeRequest';
import { CoasterActivity, CoasterWithPark } from '@logaliser/api';

export const createCoasterActivity = async (
  coasterId: number,
  firstRide: boolean,
  timestamp: string = new Date().toISOString()
) => {
  const timezoneOffset = 0 - new Date(timestamp).getTimezoneOffset();

  const body = {
    coasterId,
    firstRide,
    timestamp,
    timezoneOffset,
  };

  return makeRequest<CoasterActivity>('/activities/coaster', body);
};

export const duplicateCoasterActivity = async (activity: CoasterActivity) => {
  return createCoasterActivity(activity.item, false);
};

export const getNearbyCoasters = async (
  latitude: number,
  longitude: number
) => {
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
  });

  const path = `/coasters/nearby?${params.toString()}`;

  return makeRequest<CoasterWithPark[]>(path);
};

export const getCountryList = async () => {
  return makeRequest<string[]>('/theme-parks/countries');
};

export const searchForCoasters = async (query: string, country?: string) => {
  const params = new URLSearchParams({
    query,
  });
  if (country) {
    params.set('country', country);
  }

  const path = `/coasters/search?${params.toString()}`;

  return makeRequest<CoasterWithPark[]>(path);
};
