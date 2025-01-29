'use client';

import { useEffect, useRef, useState } from 'react';
import {
  GeolocationState,
  useGeolocation as useUnderlyingGeolocation,
} from '@uidotdev/usehooks';

type GeolocationOptions = Parameters<typeof useUnderlyingGeolocation>[0];

export interface Geolocation {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number;
}

const MOCK_GEOLOCATION = {
  latitude: 48.8714,
  longitude: 2.775,
  timestamp: Date.now(),
  accuracy: 0,
};

export const useGeolocation = (options?: GeolocationOptions) => {
  const watchId = useRef<number>(-1);

  // On localhost, mock the location for testing since the browser
  // api requires https to work
  const isLocalhost =
    typeof window !== 'undefined' && window.location.href.includes('localhost');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<GeolocationPositionError>();
  const [geolocation, setGeolocation] = useState<Geolocation | undefined>(
    isLocalhost ? MOCK_GEOLOCATION : undefined
  );

  const onEvent: PositionCallback = (position) => {
    setLoading(false);
    setError(undefined);
    setGeolocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    });

    // Once accuracy is high enough, stop watching for updates
    if (position.coords.accuracy <= 500) {
      navigator.geolocation.clearWatch(watchId.current);
    }
  };

  const onError: PositionErrorCallback = (err) => {
    setError(err);
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  useEffect(() => {
    if (!isLocalhost) {
      navigator.geolocation.getCurrentPosition(onEvent, onError);
      watchId.current = navigator.geolocation.watchPosition(onEvent, onError);

      return () => {
        navigator.geolocation.clearWatch(watchId.current);
      };
    }
  }, []);

  return { loading, error, geolocation };
};
