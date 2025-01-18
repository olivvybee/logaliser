'use client';

import { useEffect, useState } from 'react';
import {
  GeolocationState,
  useGeolocation as useUnderlyingGeolocation,
} from '@uidotdev/usehooks';

type GeolocationOptions = Parameters<typeof useUnderlyingGeolocation>[0];

export const useGeolocation = (
  options?: GeolocationOptions
): GeolocationState => {
  const [mockLoading, setMockLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setMockLoading(false), 2000);
  }, []);

  const geolocation = useUnderlyingGeolocation(options);

  // On localhost, mock the location for testing since the browser
  // api requires https to work
  if (
    typeof window !== 'undefined' &&
    window.location.href.includes('localhost')
  ) {
    return {
      loading: mockLoading,
      error: null,
      latitude: mockLoading ? null : 48.8714,
      longitude: mockLoading ? null : 2.775,
      timestamp: Date.now(),
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    };
  }

  return geolocation;
};
