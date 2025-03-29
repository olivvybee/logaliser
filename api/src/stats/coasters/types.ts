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

  inversions: TotalMinMax;
  duration: TotalMinMax;
  length: TotalMinMax;
  drop: TotalMinMax;
  height: TotalMinMax;
  speed: TotalMinMax;
  verticalAngle: TotalMinMax;

  inShowExits: {
    total: number;
    countByCoasterId: Record<number, number>;
  };

  coasters: Coaster[];
  parks: ThemePark[];

  coastersWithMissingData: number[];
}
