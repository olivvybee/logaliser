'use client';

import { makeRequest } from '../makeRequest';
import { Coaster, CoasterActivity } from '../types';
import { getApiKey } from './getApiKey';

export const createCoasterActivity = async (
  coasterId: number,
  firstRide: boolean,
  timestamp?: string
) => {
  const apiKey = getApiKey();

  const body = {
    coasterId,
    firstRide,
    timestamp,
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

  return makeRequest<Coaster[]>(path, apiKey);
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

  return makeRequest<Coaster[]>(path, apiKey);
};
