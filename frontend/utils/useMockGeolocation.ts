import { GeolocationState } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';

export const useMockGeolocation = (): Pick<
  GeolocationState,
  'loading' | 'error' | 'latitude' | 'longitude'
> => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return {
    loading,
    error: null,
    latitude: loading ? null : 48.8714,
    longitude: loading ? null : 2.775,
  };
};
