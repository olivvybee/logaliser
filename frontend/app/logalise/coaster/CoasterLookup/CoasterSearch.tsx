'use client';

import { FormEvent, useState } from 'react';

import { Button } from '@/components/Button';
import { getCountryList, searchForCoasters } from '@/lib/logaliser-api';
import { CoasterWithPark } from '@logaliser/api';
import { useQuery } from '@tanstack/react-query';

import { CoasterSelectionButton } from './CoasterSelectionButton';

import styles from './CoasterSearch.module.css';
import { TextField } from '@/components/TextField';
import { Dropdown } from '@/components/Dropdown';

interface CoasterSearchProps {
  onSelectCoaster: (coaster: CoasterWithPark) => void;
}

export const CoasterSearch = ({ onSelectCoaster }: CoasterSearchProps) => {
  const [country, setCountry] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const { data: countriesData, isLoading: countriesLoading } = useQuery({
    queryKey: ['coaster-countries'],
    queryFn: () => getCountryList(),
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['coaster-search'],
    queryFn: () => searchForCoasters(query, country),
    enabled: false,
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const countries = countriesData || [];

  return (
    <div>
      <form onSubmit={onSubmit} className={styles.form}>
        <TextField value={query} onChange={(value) => setQuery(value)} />

        <Dropdown
          value={country}
          onChange={(value) => setCountry(value)}
          options={countries}
          includeBlankOption={true}
        />

        <Button type="submit">Search</Button>
      </form>

      {isLoading && <div>Coasters loading...</div>}

      {data && (
        <div className={styles.coasterList}>
          {data.map((coaster) => (
            <CoasterSelectionButton
              key={coaster.id}
              coaster={coaster}
              onClick={() => onSelectCoaster(coaster)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
