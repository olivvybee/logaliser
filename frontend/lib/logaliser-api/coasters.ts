'use client';

import Cookies from 'js-cookie';

import { makeRequest } from './makeRequest';
import { LOGALISER_API_KEY_COOKIE_NAME } from '@/constants';
import { Coaster } from './types';

export const getNearbyCoasters = async (
  latitude: number,
  longitude: number
) => {
  const apiKey = Cookies.get(LOGALISER_API_KEY_COOKIE_NAME);

  const params = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
  });
  const path = `/coasters/nearby?${params.toString()}`;

  return makeRequest<Coaster[]>(path, apiKey);
};
