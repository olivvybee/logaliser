'use client';

import { CoasterStats as Stats } from '@/lib/logaliser-api/types';
import { Timespan } from '../types';
import { BarChart } from './BarChart';

interface CoasterStatsProps {
  stats: Stats;
  timespan: Timespan;
}

export const CoasterStats = ({ stats, timespan }: CoasterStatsProps) => {
  const barChartCounts =
    timespan === Timespan.Year ? stats.countByMonth : stats.countByDay;

  return (
    <div>
      <BarChart counts={barChartCounts} timespan={timespan} />
    </div>
  );
};
