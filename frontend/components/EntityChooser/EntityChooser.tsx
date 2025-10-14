'use client';

import { useState } from 'react';

import styles from './EntityChooser.module.css';
import { Button } from '../Button';
import { NearbyTab } from './NearbyTab';
import { SearchTab } from './SearchTab';
import { Entity } from './EntityChooser.types';

interface EntityChooserProps<TEntity extends Entity> {
  key: string;
  onSelect: (entity: TEntity) => void;
  nearbyQueryFn: (latitude: number, longitude: number) => Promise<TEntity[]>;
  searchQueryFn: (query: string, country?: string) => Promise<TEntity[]>;
  countriesQueryFn: () => Promise<string[]>;
  getName: (entity: TEntity) => string;
  getDetails: (entity: TEntity) => string | undefined;
}

export const EntityChooser = <TEntity extends Entity>({
  key,
  onSelect,
  nearbyQueryFn,
  searchQueryFn,
  countriesQueryFn,
  getName,
  getDetails,
}: EntityChooserProps<TEntity>) => {
  const [selectedTab, setSelectedTab] = useState<'nearby' | 'search'>('nearby');

  return (
    <div className={styles.entityLookup}>
      <div className={styles.tabs}>
        <Button
          theme={selectedTab === 'nearby' ? 'primary' : 'secondary'}
          onClick={() => setSelectedTab('nearby')}>
          Nearby
        </Button>

        <Button
          theme={selectedTab === 'search' ? 'primary' : 'secondary'}
          onClick={() => setSelectedTab('search')}>
          Search
        </Button>
      </div>

      {selectedTab === 'nearby' && (
        <NearbyTab
          key={key}
          onSelect={onSelect}
          queryFn={nearbyQueryFn}
          getName={getName}
          getDetails={getDetails}
        />
      )}
      {selectedTab === 'search' && (
        <SearchTab
          key={key}
          onSelect={onSelect}
          queryFn={searchQueryFn}
          countriesQueryFn={countriesQueryFn}
          getName={getName}
          getDetails={getDetails}
        />
      )}
    </div>
  );
};
