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
  Hidden = 'Hidden',
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

export interface HiddenActivity extends BaseActivity {
  type: ActivityType.Hidden;
}

export type Activity = CoasterActivity | HiddenActivity;
