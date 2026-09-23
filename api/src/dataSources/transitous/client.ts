import sortBy from 'lodash/sortBy';
import { getDistance } from '../../utils/distance';
import { getNearbyLatLong } from '../../utils/nearbyLatLong';
import { HttpClient } from '../httpClient';
import { MODE_MAP } from './constants';
import { GeocodeData } from './entities/GeocodeData';
import { LocationType } from './entities/Location';
import { Stop, TransportMode } from './entities/Stop';
import { Departure } from './entities/Departure';
import { TransportType } from './types';

const BASE_URL = 'https://api.transitous.org/api';

export class TransitousClient extends HttpClient {
  private modes: TransportMode[];

  constructor(transportType: TransportType) {
    super(BASE_URL);

    this.modes = MODE_MAP[transportType];
  }

  protected get defaultHeaders(): HeadersInit {
    return {
      ...HttpClient.defaultHeaders,
    };
  }

  public stopsAtLocation = async (latitude: number, longitude: number) => {
    const results = await this.get<GeocodeData[]>('/v1/reverse-geocode', {
      place: `${latitude},${longitude}`,
      type: LocationType.Stop,
      numResults: '20',
    });

    return results.filter((result) =>
      result.modes?.some((mode) => this.modes.includes(mode))
    );
  };

  public nearbyStops = async (latitude: number, longitude: number) => {
    const bounds = getNearbyLatLong(latitude, longitude, 0.1);

    const stops = await this.get<Stop[]>('/v6/map/stops', {
      min: `${bounds.latitude.min},${bounds.longitude.min}`,
      max: `${bounds.latitude.max},${bounds.longitude.max}`,
      grouped: 'true',
      modes: this.modes.join(','),
    });

    const stopsWithDistance = stops.map((stop) => ({
      ...stop,
      distance: getDistance(latitude, longitude, stop.lat, stop.lon),
    }));

    return sortBy(stopsWithDistance, 'distance');
  };

  public departuresFromStop = async (stopId: string) => {
    const result = await this.get<Departure[]>('/v6/stoptimes', {
      stopId,
      modes: this.modes.join(','),
      n: '20',
    });

    return result;
  };
}
