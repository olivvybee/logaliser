import { useQuery } from '@tanstack/react-query';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Spinner } from '../Spinner';
import { Entity } from './EntityChooser.types';
import { Button } from '../Button';
import styles from './EntityChooser.module.css';

interface NearbyTabProps<TEntity extends Entity> {
  key: string;
  queryFn: (latitude: number, longitude: number) => Promise<TEntity[]>;
  onSelect: (entity: TEntity) => void;
  getName: (entity: TEntity) => string;
  getDetails: (entity: TEntity) => string | undefined;
}

export const NearbyTab = <TEntity extends Entity>({
  key,
  queryFn,
  onSelect,
  getName,
  getDetails,
}: NearbyTabProps<TEntity>) => {
  const {
    loading: geolocationLoading,
    error: geolocationError,
    geolocation,
  } = useGeolocation();

  const {
    data,
    isLoading: queryLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['nearby-entities', key],
    queryFn: () =>
      queryFn(geolocation?.latitude || -1, geolocation?.longitude || -1),
    enabled: !!geolocation,
  });

  if (geolocationLoading || queryLoading) {
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

  if (!data || queryError) {
    return (
      <div className={styles.container}>
        <span className={styles.message}>
          Error loading data: {JSON.stringify(queryError, null, 2)}
        </span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.container}>
        <span className={styles.message}>Nothing found nearby.</span>
      </div>
    );
  }

  return (
    <div className={styles.entityList}>
      {data.map((item) => {
        const name = getName(item);
        const details = getDetails(item);

        return (
          <Button
            key={item.id}
            type="button"
            theme="secondary"
            className={styles.entitySelectionButton}
            onClick={() => onSelect(item)}>
            <span className={styles.entityName}>{name}</span>
            {!!details && (
              <span className={styles.entityDetails}>{details}</span>
            )}
          </Button>
        );
      })}
    </div>
  );
};
