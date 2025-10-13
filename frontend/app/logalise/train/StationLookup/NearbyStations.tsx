import { useQuery } from '@tanstack/react-query';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getNearbyStations } from '@/lib/logaliser-api/trains';
import { Station } from '@logaliser/api';
import styles from './NearbyStations.module.css';
import { Spinner } from '@/components/Spinner';
import { StationSelectionButton } from './StationSelectionButton';

interface NearbyStationsProps {
  onSelectStation: (station: Station) => void;
}

export const NearbyStations = ({ onSelectStation }: NearbyStationsProps) => {
  const {
    loading: geolocationLoading,
    error: geolocationError,
    geolocation,
  } = useGeolocation();

  const {
    data,
    isLoading: stationsLoading,
    error: stationsError,
  } = useQuery({
    queryKey: ['nearby-stations'],
    queryFn: () =>
      getNearbyStations(
        geolocation?.latitude || -1,
        geolocation?.longitude || -1
      ),
    enabled: !!geolocation,
  });

  console.log({ data, stationsLoading, stationsError, geolocation });

  if (geolocationLoading || stationsLoading) {
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

  if (!data || stationsError) {
    return (
      <div className={styles.container}>
        <span className={styles.message}>
          Error loading coasters: {JSON.stringify(stationsError, null, 2)}
        </span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.container}>
        <span className={styles.message}>No stations found nearby.</span>
      </div>
    );
  }

  return (
    <div className={styles.stationList}>
      {data.map((station) => (
        <StationSelectionButton
          key={station.id}
          station={station}
          onClick={() => onSelectStation(station)}
        />
      ))}
    </div>
  );
};
