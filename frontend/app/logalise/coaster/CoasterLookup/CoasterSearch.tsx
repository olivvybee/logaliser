'use client';

import { Button } from '@/components/Button';
import {
  getCountryList,
  searchForCoasters,
} from '@/lib/logaliser-api/client/coasters';
import { Coaster } from '@/lib/logaliser-api/types';
import { useQuery } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

interface CoasterSearchProps {
  onSelectCoaster: (coaster: Coaster) => void;
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
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          disabled={countriesLoading}>
          <option value="">---</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <Button type="submit">Search</Button>
      </form>

      {isLoading && <div>Coasters loading...</div>}

      {data && (
        <div>
          {data.map((coaster) => (
            <div key={coaster.id}>
              <Button onClick={() => onSelectCoaster(coaster)}>
                {coaster.name} ({coaster.park.name})
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
