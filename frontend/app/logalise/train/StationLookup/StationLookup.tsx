'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import styles from './StationLookup.module.css';
import { NearbyStations } from './NearbyStations';
import { Station } from '@logaliser/api';

interface StationLookupProps {
  onSelectStation: (station: Station) => void;
}

export const StationLookup = ({ onSelectStation }: StationLookupProps) => {
  const [selectedTab, setSelectedTab] = useState<'nearby' | 'search'>('nearby');

  return (
    <div>
      <div className={styles.tabs}>
        <Button
          theme={selectedTab === 'nearby' ? 'primary' : 'secondary'}
          onClick={() => setSelectedTab('nearby')}>
          Nearby
        </Button>

        {/* <Button
          theme={selectedTab === 'search' ? 'primary' : 'secondary'}
          onClick={() => setSelectedTab('search')}>
          Search
        </Button> */}
      </div>

      {selectedTab === 'nearby' && (
        <NearbyStations onSelectStation={onSelectStation} />
      )}
    </div>
  );
};
