export enum TransportMode {
  AerialLift = 'AERIAL_LIFT',
  Airplane = 'AIRPLANE',
  Bike = 'BIKE',
  Bus = 'BUS',
  CableCar = 'CABLE_CAR',
  Car = 'CAR',
  CarDropoff = 'CAR_DROPOFF',
  CarParking = 'CAR_PARKING',
  Coach = 'COACH',
  Ferry = 'FERRY',
  Flex = 'FLEX',
  Funicular = 'FUNICULAR',
  HGV = 'HGV',
  HighspeedRail = 'HIGHSPEED_RAIL',
  LongDistance = 'LONG_DISTANCE',
  Metro = 'METRO',
  NightRail = 'NIGHT_RAIL',
  ODM = 'ODM',
  Other = 'OTHER',
  Rail = 'RAIL',
  RegionalFastRail = 'REGIONAL_FAST_RAIL',
  RegionalRail = 'REGIONAL_RAIL',
  Rental = 'RENTAL',
  RideSharing = 'RIDE_SHARING',
  Suburban = 'SUBURBAN',
  Subway = 'SUBWAY',
  Tram = 'TRAM',
  Transit = 'TRANSIT',
  Walk = 'WALK',
}

export interface Stop {
  name: string;
  stopId?: string;
  parentId?: string;
  lat: number;
  lon: number;
  modes?: TransportMode[];
  stopCode?: string;
}

export interface StopDeparture extends Stop {
  departure?: string;
  scheduledDeparture?: string;
  arrival?: string;
  scheduledArrival?: string;
  track?: string;
  scheduledTrack?: string;
}
