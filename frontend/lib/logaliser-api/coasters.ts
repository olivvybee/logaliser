'use client';

import { makeRequest } from './makeRequest';
import { Coaster } from './types';
import { getClientSideCookie } from './cookie/getClientSideCookie';

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
