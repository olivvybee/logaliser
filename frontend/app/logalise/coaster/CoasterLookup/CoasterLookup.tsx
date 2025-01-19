'use client';

import { Coaster } from '@/lib/logaliser-api/types';
import { NearbyCoasters } from './NearbyCoasters';
import { useState } from 'react';

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
      <NearbyCoasters onSelectCoaster={setSelectedCoaster} />;
      <pre>{JSON.stringify(countries, null, 2)}</pre>
    </div>
  );
};
