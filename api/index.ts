import { type Activity as DBActivity } from '@prisma/client';
import * as DBTypes from './src/db/types';

export { type Station } from '@prisma/client';

export type AsResponse<TActivity extends DBActivity> = DBTypes.DateToString<
  TActivity,
  'timestamp'
>;

export { ActivityType } from './src/db/types';
export type { CoasterWithPark as Coaster } from './src/db/types';
export * from './src/stats/types';

export type AnyActivity = AsResponse<DBTypes.AnyActivity>;
export type CoasterActivity = AsResponse<DBTypes.ConcreteCoasterActivity>;
export type TrainActivity = AsResponse<DBTypes.ConcreteTrainActivity>;

export * from './src/db/getActivityType';
