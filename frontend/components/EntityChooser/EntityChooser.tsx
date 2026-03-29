'use client';

import { act, useState } from 'react';

import styles from './EntityChooser.module.css';
import { Button } from '../Button';
import { NearbyTab } from './NearbyTab';
import { SearchTab } from './SearchTab';
import { Entity } from './EntityChooser.types';
import { ActivityType } from '@logaliser/api';

interface EntityChooserProps<TEntity extends Entity> {
  activityType: ActivityType;
  onSelect: (entity: TEntity) => void;
  searchQueryFn: (query: string, country?: string) => Promise<TEntity[]>;
  countriesQueryFn: () => Promise<string[]>;
  getName: (entity: TEntity) => string;
  getDetails: (entity: TEntity) => string | undefined;
}

export const EntityChooser = <TEntity extends Entity>({
  activityType,
  onSelect,
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
          activityType={activityType}
          onSelect={onSelect}
          getName={getName}
          getDetails={getDetails}
        />
      )}
      {selectedTab === 'search' && (
        <SearchTab
          key={activityType}
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
