import { type Activity as DBActivity } from '@prisma/client';
import * as DBTypes from './src/db/types';

type AsResponse<TActivity extends DBActivity> = Omit<TActivity, 'timestamp'> & {
  timestamp: string;
};

export { ActivityType } from './src/db/types';
export type { CoasterWithPark as Coaster } from './src/db/types';
export * from './src/stats/types';

export type AnyActivity = AsResponse<DBTypes.AnyActivity>;
export type CoasterActivity = AsResponse<DBTypes.ConcreteCoasterActivity>;

export * from './src/db/getActivityType';
