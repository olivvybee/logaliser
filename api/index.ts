import { type Activity as DBActivity } from '@prisma/client';
import * as DBTypes from './src/db/types';

export type { CoasterWithPark as Coaster } from './src/db/types';
export * from './src/stats/types';

type AsResponse<TActivity extends DBActivity> = Omit<TActivity, 'timestamp'> & {
  startDate: string | null;
  endDate: string;
};

export type AnyActivity = AsResponse<DBTypes.AnyActivity>;
export type CoasterActivity = AsResponse<DBTypes.ConcreteCoasterActivity>;
