import { Activity, ActivityType, Coaster } from '@prisma/client';

export interface CoasterWithPark extends Coaster {
  park: {
    name: string;
  };
}

export interface CoasterActivity extends Activity {
  type: 'Coaster';
  coaster: CoasterWithPark;
}

export type ExtendedActivity = Activity | CoasterActivity;

export type ExtensionFn = (
  activities: Activity[]
) => Promise<ExtendedActivity[]>;
