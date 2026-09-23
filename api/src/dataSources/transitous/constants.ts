import { TransportMode } from './entities/Stop';
import { TransportType } from './types';

export const MODE_MAP: Record<TransportType, TransportMode[]> = {
  [TransportType.Train]: [
    TransportMode.Rail,
    TransportMode.NightRail,
    TransportMode.RegionalRail,
    TransportMode.RegionalFastRail,
    TransportMode.HighspeedRail,
    TransportMode.Suburban,
    TransportMode.LongDistance,
    TransportMode.Metro,
    TransportMode.Subway,
    TransportMode.Tram,
    TransportMode.Funicular,
  ],

  [TransportType.Bus]: [TransportMode.Bus, TransportMode.Coach],

  [TransportType.Air]: [TransportMode.Airplane],

  [TransportType.Water]: [TransportMode.Ferry],
};
