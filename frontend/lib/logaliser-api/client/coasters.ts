'use client';

import { makeRequest } from '../makeRequest';
import { Coaster, CoasterActivity } from '../types';
import { getClientSideCookie } from './getClientSideCookie';

export const createCoasterActivity = async (
  coasterId: number,
  firstRide: boolean
) => {
  const apiKey = getClientSideCookie();

  const body = {
    coasterId,
    firstRide,
  };

  await makeRequest<CoasterActivity>('/activities/coaster', apiKey, body);
};

export const getNearbyCoasters = async (
  latitude: number,
  longitude: number
) => {
  const apiKey = getClientSideCookie();

  const params = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
  });

  const path = `/coasters/nearby?${params.toString()}`;

  return makeRequest<Coaster[]>(path, apiKey);
};

export const getCountryList = async () => {
  const apiKey = getClientSideCookie();

  return makeRequest<string[]>('/theme-parks/countries', apiKey);
};

export const searchForCoasters = async (query: string, country?: string) => {
  const apiKey = getClientSideCookie();

  const params = new URLSearchParams({
    query,
  });
  if (country) {
    params.set('country', country);
  }

  const path = `/coasters/search?${params.toString()}`;

  return makeRequest<Coaster[]>(path, apiKey);
};
