'use client';

import { Coaster } from '@/lib/logaliser-api/types';
import { NearbyCoasters } from './NearbyCoasters';
import { useState } from 'react';

const LogaliseCoasterPage = () => {
  const [selectedCoaster, setSelectedCoaster] = useState<Coaster>();

  if (selectedCoaster) {
    return (
      <div>
        Selected {selectedCoaster.name} at {selectedCoaster.park.name}
      </div>
    );
  }

  return <NearbyCoasters onSelectCoaster={setSelectedCoaster} />;
};

export default LogaliseCoasterPage;
