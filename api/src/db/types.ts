import { Activity, Coaster, CoasterActivity, ThemePark } from '@prisma/client';

export enum ActivityType {
  Coaster = 'coaster',
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
}

export interface ConcreteCoasterActivity extends AnyActivity {
  coasterActivity: CoasterActivityData;
}
