'use client';

import { searchForCoasters } from '@/lib/logaliser-api/client/coasters';
import { Coaster } from '@/lib/logaliser-api/types';
import { useQuery } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

interface CoasterSearchProps {
  countries: string[];
  onSelectCoaster: (coaster: Coaster) => void;
}

export const CoasterSearch = ({
  countries,
  onSelectCoaster,
}: CoasterSearchProps) => {
  const [country, setCountry] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['coaster-search'],
    queryFn: () => searchForCoasters(query, country),
    enabled: false,
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">---</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <button type="submit">Search</button>
      </form>

      {isLoading && <div>Coasters loading...</div>}

      {data && (
        <div>
          {data.map((coaster) => (
            <div key={coaster.id}>
              <button onClick={() => onSelectCoaster(coaster)}>
                {coaster.name} ({coaster.park.name})
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
