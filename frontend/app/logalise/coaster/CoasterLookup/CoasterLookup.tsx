'use client';

import { Coaster } from '@/lib/logaliser-api/types';
import { NearbyCoasters } from './NearbyCoasters';
import { useState } from 'react';
import { CoasterSearch } from './CoasterSearch';

interface CoasterLookupProps {
  countries: string[];
}

export const CoasterLookup = ({ countries }: CoasterLookupProps) => {
  const [selectedCoaster, setSelectedCoaster] = useState<Coaster>();

  if (selectedCoaster) {
    return (
      <div>
        Selected {selectedCoaster.name} at {selectedCoaster.park.name}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <NearbyCoasters onSelectCoaster={setSelectedCoaster} />
      <CoasterSearch
        onSelectCoaster={setSelectedCoaster}
        countries={countries}
      />
    </div>
  );
};
