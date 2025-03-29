import { Activity, Coaster, ThemePark } from '@prisma/client';

export interface CoasterWithPark extends Coaster {
  park: ThemePark;
}

export interface CoasterActivity extends Activity {
  type: 'Coaster';
  coaster: CoasterWithPark;
  metadata: {
    firstRide: boolean;
    inShowExit: boolean;
  };
}

export type ExtendedActivity = Activity | CoasterActivity;

export type ExtensionFn = (
  activities: Activity[]
) => Promise<ExtendedActivity[]>;
