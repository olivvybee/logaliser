import { Area } from './Area';
import { LocationType } from './Location';
import { TransportMode } from './Stop';

export interface GeocodeData {
  type: LocationType;
  category?: string;
  tokens: number[];
  name: string;
  id: string;
  lat: number;
  lon: number;
  street?: string;
  country?: string;
  modes?: TransportMode[];
  score: number;
  areas?: Area[];
}
