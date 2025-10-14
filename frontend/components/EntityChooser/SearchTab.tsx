import { FormEvent, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Entity } from './EntityChooser.types';
import styles from './EntityChooser.module.css';
import { TextField } from '../TextField';
import { Dropdown } from '../Dropdown';
import { Button } from '../Button';
import { Spinner } from '../Spinner';

interface SearchTabProps<TEntity extends Entity> {
  key: string;
  countriesQueryFn: () => Promise<string[]>;
  queryFn: (query: string, country?: string) => Promise<TEntity[]>;
  onSelect: (entity: TEntity) => void;
  getName: (entity: TEntity) => string;
  getDetails: (entity: TEntity) => string | undefined;
}

export const SearchTab = <TEntity extends Entity>({
  key,
  countriesQueryFn,
  queryFn,
  onSelect,
  getName,
  getDetails,
}: SearchTabProps<TEntity>) => {
  const [country, setCountry] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const { data: countriesData, isLoading: countriesLoading } = useQuery({
    queryKey: ['search-countries', key],
    queryFn: countriesQueryFn,
  });

  const {
    data,
    isLoading: queryLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['coaster-search'],
    queryFn: () => queryFn(query, country),
    enabled: false,
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const isLoading = countriesLoading || queryLoading;

  const countries = countriesData || [];

  return (
    <div>
      <form onSubmit={onSubmit} className={styles.searchForm}>
        <TextField value={query} onChange={(value) => setQuery(value)} />

        <Dropdown
          value={country}
          onChange={(value) => setCountry(value)}
          options={countries}
          includeBlankOption={true}
        />

        <Button type="submit">Search</Button>
      </form>

      {isLoading && (
        <div className={styles.container}>
          <Spinner size={48} />
        </div>
      )}

      {data && (
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
      )}
    </div>
  );
};
