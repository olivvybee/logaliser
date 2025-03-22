'use client';

import { getNearbyCoasters } from '@/lib/logaliser-api';
import { Coaster } from '@logaliser/api';

import { useQuery } from '@tanstack/react-query';
import { useGeolocation } from '@/hooks/useGeolocation';

import { CoasterSelectionButton } from './CoasterSelectionButton';

import styles from './NearbyCoasters.module.css';
import { Spinner } from '@/components/Spinner';

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

  if (geolocationLoading || coastersLoading) {
    return (
      <div className={styles.container}>
        <Spinner size={48} />
      </div>
    );
  }

  if (geolocationError) {
    return (
      <div className={styles.container}>
        <span className={styles.message}>
          Error loading geolocation: {geolocationError.code}
        </span>
      </div>
    );
  }

  if (!data || coastersError) {
    return (
      <div className={styles.container}>
        <span className={styles.message}>
          Error loading coasters: {JSON.stringify(coastersError, null, 2)}
        </span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.container}>
        <span className={styles.message}>No coasters found nearby.</span>
      </div>
    );
  }

  return (
    <div className={styles.coasterList}>
      {data.map((coaster) => (
        <CoasterSelectionButton
          key={coaster.id}
          coaster={coaster}
          onClick={() => onSelectCoaster(coaster)}
        />
      ))}
    </div>
  );
};
