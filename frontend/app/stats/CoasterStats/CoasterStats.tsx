'use client';

import { CoasterStats as Stats } from '@/lib/logaliser-api/types';
import { Timespan } from '../types';
import { BarChart } from './BarChart';

import styles from './CoasterStats.module.css';
import statStyles from '../Stat/Stat.module.css';

import { Stat } from '../Stat';
import {
  kmToMiles,
  metersToFeet,
  metersToMiles,
} from '../utils/convertDistance';
import { displayDuration, secondsToDuration } from '../utils/convertDuration';

interface CoasterStatsProps {
  stats: Stats;
  timespan: Timespan;
}

export const CoasterStats = ({ stats, timespan }: CoasterStatsProps) => {
  const barChartCounts =
    timespan === Timespan.Year ? stats.countByMonth : stats.countByDay;

  const getCoasterName = (id: number) => {
    const coaster = stats.coasters.find((coaster) => coaster.id === id);
    return coaster?.name;
  };

  return (
    <>
      <BarChart counts={barChartCounts} timespan={timespan} />

      <div className={styles.grid}>
        <Stat label="Unique coasters" value={stats.coasters.length} />
        <Stat label="Total rides" value={stats.totalCount} />
        {stats.inversions.total !== undefined && (
          <Stat
            label={<span className={styles.inverted}>Total inversions</span>}
            value={stats.inversions.total}
          />
        )}
        {stats.length.total !== undefined && (
          <Stat
            label="Total distance"
            value={metersToMiles(stats.length.total)}
            unit="mi"
          />
        )}
        {stats.duration.total !== undefined && (
          <Stat
            label="Total time"
            value={displayDuration(stats.duration.total)}
          />
        )}

        {stats.inversions.max && (
          <Stat
            label="Most inverted coaster"
            value={stats.inversions.max.value}
            extraInfo={getCoasterName(stats.inversions.max.id)}
          />
        )}
        {stats.height.max && (
          <Stat
            label="Tallest coaster"
            value={metersToFeet(stats.height.max.value)}
            unit="ft"
            extraInfo={getCoasterName(stats.height.max.id)}
          />
        )}
        {stats.speed.max && (
          <Stat
            label="Fastest coaster"
            value={kmToMiles(stats.speed.max.value)}
            unit="mph"
            extraInfo={getCoasterName(stats.speed.max.id)}
          />
        )}

        {stats.length.min && (
          <Stat
            label="Shortest coaster"
            value={metersToFeet(stats.length.min.value)}
            unit="ft"
            extraInfo={getCoasterName(stats.length.min.id)}
          />
        )}
        {stats.length.max && (
          <Stat
            label="Longest coaster"
            value={metersToFeet(stats.length.max.value)}
            unit="ft"
            extraInfo={getCoasterName(stats.length.max.id)}
          />
        )}

        {stats.duration.min && (
          <Stat
            label="Shortest duration"
            value={displayDuration(stats.duration.min.value)}
            extraInfo={getCoasterName(stats.duration.min.id)}
          />
        )}
        {stats.duration.max && (
          <Stat
            label="Longest duration"
            value={displayDuration(stats.duration.max.value)}
            extraInfo={getCoasterName(stats.duration.max.id)}
          />
        )}
      </div>
    </>
  );
};
