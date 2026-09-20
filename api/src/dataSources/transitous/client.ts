import sortBy from 'lodash/sortBy';
import { getDistance } from '../../utils/distance';
import { getNearbyLatLong } from '../../utils/nearbyLatLong';
import { HttpClient } from '../httpClient';
import { TRAIN_MODES } from './constants';
import { GeocodeData } from './entities/GeocodeData';
import { LocationType } from './entities/Location';
import { Stop, TransportMode } from './entities/Stop';

const BASE_URL = 'https://api.transitous.org/api';

export class TransitousClient extends HttpClient {
  constructor() {
    super(BASE_URL);
  }

  protected get defaultHeaders(): HeadersInit {
    return {
      ...HttpClient.defaultHeaders,
    };
  }

  public nearbyStations = async (latitude: number, longitude: number) => {
    const results = await this.get<GeocodeData[]>('/v1/reverse-geocode', {
      place: `${latitude},${longitude}`,
      type: LocationType.Stop,
      numResults: '20',
    });

    console.log(JSON.stringify(results, null, 2));

    return results.filter((result) =>
      result.modes?.some((mode) => TRAIN_MODES.includes(mode))
    );
  };

  public stationsInArea = async (latitude: number, longitude: number) => {
    const bounds = getNearbyLatLong(latitude, longitude, 0.1);

    const stations = await this.get<Stop[]>('/v6/map/stops', {
      min: `${bounds.latitude.min},${bounds.longitude.min}`,
      max: `${bounds.latitude.max},${bounds.longitude.max}`,
      grouped: 'true',
      modes: TRAIN_MODES.join(','),
    });

    const stationsWithDistance = stations.map((station) => ({
      ...station,
      distance: getDistance(latitude, longitude, station.lat, station.lon),
    }));

    return sortBy(stationsWithDistance, 'distance');
  };
}
