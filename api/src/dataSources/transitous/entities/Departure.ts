import { Stop, StopDeparture, TransportMode } from './Stop';

export interface Departure {
  tripId: string;
  place: StopDeparture;
  mode: TransportMode;
  realTime: boolean;
  headsign: string | null;
  tripFrom: Stop;
  tripTo: Stop;
  agencyId: string;
  agencyName: string;
  displayName: string;
}
