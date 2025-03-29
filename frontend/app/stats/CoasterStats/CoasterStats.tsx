'use client';

import { CoasterStats as Stats } from '@logaliser/api';
import { Timespan } from '../types';
import { BarChart } from './BarChart';

import styles from './CoasterStats.module.css';

import { Stat, displayDuration } from '../StatBox';
import {
  kmToMiles,
  metersToFeet,
  metersToMiles,
} from '../utils/convertDistance';
import { RankingTable } from '../RankingTable';

interface CoasterStatsProps {
  stats: Stats;
  timespan: Timespan;
}

export const CoasterStats = ({ stats, timespan }: CoasterStatsProps) => {
  const barChartCounts =
    timespan === Timespan.Year ? stats.countByMonth : stats.countByDay;

  const getCoasterName = (id: number | string) => {
    const idAsNumber = typeof id === 'string' ? parseInt(id) : id;
    const coaster = stats.coasters.find((coaster) => coaster.id === idAsNumber);
    return coaster?.name;
  };

  const getParkName = (id: number | string) => {
    const idAsNumber = typeof id === 'string' ? parseInt(id) : id;
    const park = stats.parks.find((park) => park.id === idAsNumber);
    return park?.name;
  };

  if (stats.totalCount === 0) {
    return <div className={styles.noStats}>No stats for this time period.</div>;
  }

  return (
    <>
      <BarChart counts={barChartCounts} timespan={timespan} />

      <div className={styles.statBoxes}>
        <Stat label="Unique coasters" value={stats.coasters.length} />
        <Stat label="Total rides" value={stats.totalCount} />
        {stats.inversions.total !== undefined && (
          <Stat
            label={<span className={styles.inverted}>Total inversions</span>}
            value={stats.inversions.total}
          />
        )}

        {stats.inShowExits.total && (
          <Stat label="In-show exits" value={stats.inShowExits.total} />
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

      <div className={styles.tables}>
        <RankingTable
          title="Favourite coasters"
          labelColumnName="Coaster"
          valueColumnName="Rides"
          entries={Object.entries(stats.countByCoasterId).map(
            ([id, value]) => ({
              label: getCoasterName(id) || '-',
              value,
            })
          )}
        />
        <RankingTable
          title="Favourite parks"
          labelColumnName="Park"
          valueColumnName="Rides"
          entries={Object.entries(stats.countByParkId).map(([id, value]) => ({
            label: getParkName(id) || '',
            value,
          }))}
        />
        <RankingTable
          title="Favourite manufacturers"
          labelColumnName="Manufacturer"
          valueColumnName="Rides"
          entries={Object.entries(stats.countByManufacturer).map(
            ([label, value]) => ({ label, value })
          )}
        />
        <RankingTable
          title="Favourite countries"
          labelColumnName="Country"
          valueColumnName="Rides"
          entries={Object.entries(stats.countByCountry).map(
            ([label, value]) => ({
              label,
              value,
            })
          )}
        />

        {stats.inShowExits.total && (
          <RankingTable
            title="Most broken coasters"
            labelColumnName="Coaster"
            valueColumnName="In&#8209;show exits"
            entries={Object.entries(stats.inShowExits.countByCoasterId).map(
              ([id, value]) => ({
                label: getCoasterName(id) || '-',
                value,
              })
            )}
          />
        )}
      </div>
    </>
  );
};
