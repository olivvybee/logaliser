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
}

export type Activity = CoasterActivity;
