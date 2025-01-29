import { Coaster } from '@/lib/logaliser-api/types';
import { NearbyCoasters } from './NearbyCoasters';
import { CoasterSearch } from './CoasterSearch';

interface CoasterLookupProps {
  onSelectCoaster: (coaster: Coaster) => void;
}

export const CoasterLookup = ({
  onSelectCoaster: selectCoaster,
}: CoasterLookupProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>Logalise a coaster</h1>
      <NearbyCoasters onSelectCoaster={selectCoaster} />
      <CoasterSearch onSelectCoaster={selectCoaster} />
    </div>
  );
};
