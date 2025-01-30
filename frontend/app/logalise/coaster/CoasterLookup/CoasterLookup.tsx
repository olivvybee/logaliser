import { useState } from 'react';

import { Coaster } from '@/lib/logaliser-api/types';

import { NearbyCoasters } from './NearbyCoasters';
import { CoasterSearch } from './CoasterSearch';

import styles from './CoasterLookup.module.css';
import { Button } from '@/components/Button';

interface CoasterLookupProps {
  onSelectCoaster: (coaster: Coaster) => void;
}

export const CoasterLookup = ({
  onSelectCoaster: selectCoaster,
}: CoasterLookupProps) => {
  const [selectedTab, setSelectedTab] = useState<'nearby' | 'search'>('nearby');

  return (
    <div className={styles.coasterLookup}>
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
        <NearbyCoasters onSelectCoaster={selectCoaster} />
      )}
      {selectedTab === 'search' && (
        <CoasterSearch onSelectCoaster={selectCoaster} />
      )}
    </div>
  );
};
