import { type Activity as DBActivity } from '@prisma/client';
import * as DBTypes from './src/db/types';

export type { ActivityType, $Enums } from '@prisma/client';
export type { CoasterWithPark as Coaster } from './src/db/types';
export * from './src/stats/types';

type AsResponse<TActivity extends DBActivity> = Omit<
  TActivity,
  'startDate' | 'endDate'
> & {
  startDate: string | null;
  endDate: string;
};

export type Activity = AsResponse<DBActivity>;
export type CoasterActivity = AsResponse<DBTypes.CoasterActivity>;
