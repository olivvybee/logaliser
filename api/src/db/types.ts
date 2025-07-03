import {
  Activity,
  Coaster,
  CoasterActivity,
  Station,
  ThemePark,
  TrainActivity,
} from '@prisma/client';

export type DateToString<T, KFields extends keyof T = never> = Omit<
  T,
  KFields
> & {
  [K in KFields]: string;
};

export enum ActivityType {
  Coaster = 'coaster',
  Train = 'train',
  Unknown = 'unknown',
}

export interface CoasterWithPark extends Coaster {
  park: ThemePark;
}

export interface CoasterActivityData extends CoasterActivity {
  coaster: CoasterWithPark;
}

export interface AnyActivity extends Activity {
  coasterActivity?: CoasterActivityData;
  trainActivity?: TrainActivityData;
}

export interface ConcreteCoasterActivity extends AnyActivity {
  coasterActivity: CoasterActivityData;
}

export interface TrainActivityData
  extends DateToString<TrainActivity, 'departureTime' | 'arrivalTime'> {
  origin: Station;
  destination: Station;
}

export interface ConcreteTrainActivity extends AnyActivity {
  trainActivity: TrainActivityData;
}
