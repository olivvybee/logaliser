export interface Coaster {
  id: number;
  name: string;
  parkId: number;
  opened?: string;
  latitude?: number;
  longitude?: number;
  make?: string;
  model?: string;
  type?: string;
  design?: string;
  length?: number;
  height?: number;
  drop?: number;
  speed?: number;
  verticalAngle?: number;
  inversions?: number;
  duration?: number;
  park: {
    name: string;
  };
}

export interface Park {
  id: number;
  name: string;
  country: string;
}

export enum ActivityType {
  Coaster = 'Coaster',
}

interface BaseActivity {
  id: number;
  startDate: string;
  endDate: string;
  type: ActivityType;
  item: number;
  metadata: unknown;
}

export interface CoasterActivity extends BaseActivity {
  type: ActivityType.Coaster;
  metadata: {
    firstRide?: boolean;
  };
  coaster: Coaster;
}

export type Activity = CoasterActivity;

interface MinMax {
  total: number | undefined;
  min: { id: number; value: number } | undefined;
  max: { id: number; value: number } | undefined;
  highestDay: { day: string; value: number } | undefined;
}

export interface CoasterStats {
  totalCount: number;
  countByCoasterId: Record<string, number>;
  countByManufacturer: Record<string, number>;
  countByType: Record<string, number>;
  countByParkId: Record<string, number>;
  countByCountry: Record<string, number>;
  countByDay: Record<string, number>;
  countByMonth: Record<string, number>;
  inversions: MinMax;
  duration: MinMax;
  length: MinMax;
  drop: MinMax;
  height: MinMax;
  speed: MinMax;
  verticalAngle: MinMax;
  coasters: Coaster[];
  parks: Park[];
}
