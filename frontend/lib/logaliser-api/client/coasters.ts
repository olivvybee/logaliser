'use client';

import { makeRequest } from '../makeRequest';
import { CoasterActivity, CoasterWithPark } from '@logaliser/api';
import { getApiKey } from './getApiKey';

export const createCoasterActivity = async (
  coasterId: number,
  firstRide: boolean,
  timestamp: string = new Date().toISOString()
) => {
  const apiKey = getApiKey();

  const timezoneOffset = 0 - new Date(timestamp).getTimezoneOffset();

  const body = {
    coasterId,
    firstRide,
    timestamp,
    timezoneOffset,
  };

  return makeRequest<CoasterActivity>('/activities/coaster', apiKey, body);
};

export const duplicateCoasterActivity = async (activity: CoasterActivity) => {
  return createCoasterActivity(activity.item, false);
};

export const getNearbyCoasters = async (
  latitude: number,
  longitude: number
) => {
  const apiKey = getApiKey();

  const params = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
  });

  const path = `/coasters/nearby?${params.toString()}`;

  return makeRequest<CoasterWithPark[]>(path, apiKey);
};

export const getCountryList = async () => {
  const apiKey = getApiKey();

  return makeRequest<string[]>('/theme-parks/countries', apiKey);
};

export const searchForCoasters = async (query: string, country?: string) => {
  const apiKey = getApiKey();

  const params = new URLSearchParams({
    query,
  });
  if (country) {
    params.set('country', country);
  }

  const path = `/coasters/search?${params.toString()}`;

  return makeRequest<CoasterWithPark[]>(path, apiKey);
};
