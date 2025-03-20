export * from './coasters/types';

export interface TotalMinMax {
  total: number | undefined;
  min: { id: number; value: number } | undefined;
  max: { id: number; value: number } | undefined;
  highestDay: { day: string; value: number } | undefined;
}
