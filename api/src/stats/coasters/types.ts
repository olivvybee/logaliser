import { Coaster, ThemePark } from '@prisma/client';
import { TotalMinMax } from '../types';

export interface CoasterStats {
  totalCount: number;
  countByCoasterId: Record<number, number>;
  countByManufacturer: Record<string, number>;
  countByType: Record<string, number>;
  countByParkId: Record<number, number>;
  countByCountry: Record<string, number>;

  countByDay: Record<string, number>;
  countByMonth: Record<number, number>;
  daysInParks: number;

  inversions: TotalMinMax;
  duration: TotalMinMax;
  length: TotalMinMax;
  drop: TotalMinMax;
  height: TotalMinMax;
  speed: TotalMinMax;
  verticalAngle: TotalMinMax;

  newCoasters: {
    total: number;
    coasters: number[];
  };
  inShowExits: {
    total: number;
    countByCoasterId: Record<number, number>;
  };

  coasters: Coaster[];
  parks: ThemePark[];

  coastersWithMissingData: number[];
}
