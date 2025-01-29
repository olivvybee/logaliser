'use client';

import { getNearbyCoasters } from '@/lib/logaliser-api/client/coasters';
import { Coaster } from '@/lib/logaliser-api/types';
import { useQuery } from '@tanstack/react-query';
import { useGeolocation } from '@/hooks/useGeolocation';

interface NearbyCoastersProps {
  onSelectCoaster: (coaster: Coaster) => void;
}

export const NearbyCoasters = ({ onSelectCoaster }: NearbyCoastersProps) => {
  const {
    loading: geolocationLoading,
    error: geolocationError,
    geolocation,
  } = useGeolocation();

  const {
    data,
    isLoading: coastersLoading,
    error: coastersError,
  } = useQuery({
    queryKey: ['nearby-coasters'],
    queryFn: () =>
      getNearbyCoasters(
        geolocation?.latitude || -1,
        geolocation?.longitude || -1
      ),
    enabled: !!geolocation,
  });

  if (geolocationLoading) {
    return <div>Loading location...</div>;
  }

  if (geolocationError) {
    return <div>Error: {geolocationError.code}</div>;
  }

  if (coastersLoading) {
    return <div>Loading coasters...</div>;
  }

  if (!data || coastersError) {
    return (
      <div>
        Error loading coasters: {JSON.stringify(coastersError, null, 2)}
      </div>
    );
  }

  return (
    <div>
      <div>
        <pre>{JSON.stringify(geolocation, null, 2)}</pre>
      </div>

      {data.map((coaster) => (
        <div key={coaster.id}>
          <button onClick={() => onSelectCoaster(coaster)}>
            {coaster.name} ({coaster.park.name})
          </button>
        </div>
      ))}
    </div>
  );
};
