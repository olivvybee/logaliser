'use client';

import { getNearbyCoasters } from '@/lib/logaliser-api/coasters';
import { makeRequest } from '@/lib/logaliser-api/makeRequest';
import { useMockGeolocation } from '@/utils/useMockGeolocation';
import { useQuery } from '@tanstack/react-query';
import { useGeolocation } from '@uidotdev/usehooks';

interface NearbyCoastersResultItem {
  id: number;
  name: string;
  park: {
    name: string;
  };
}

export const NearbyCoasters = () => {
  const { loading, error, latitude, longitude } = useMockGeolocation();

  const { data, isLoading } = useQuery({
    queryKey: ['nearby-coasters'],
    queryFn: () => getNearbyCoasters(latitude || -1, longitude || -1),
    enabled: !!latitude && !!longitude,
  });

  if (loading) {
    return <div>Loading location...</div>;
  }

  if (error) {
    return <div>Error: {error.code}</div>;
  }

  return (
    <div>
      <div>
        Latitude: {latitude}, Longitude: {longitude}
      </div>

      {isLoading ? (
        <div>Loading coasters...</div>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
};
