import { CoasterActivity, CoasterWithPark } from '@/db/types';
import _uniqBy from 'lodash/uniqBy';
import _groupBy from 'lodash/groupBy';
import _sumBy from 'lodash/sumBy';
import _minBy from 'lodash/minBy';
import _maxBy from 'lodash/maxBy';
import _countBy from 'lodash/countBy';
import { minMax } from '@/utils/minMax';
import { filterAndSum } from '@/utils/filterAndSum';

export const calculateCoasterStats = (activities: CoasterActivity[]) => {
  const coasters = _uniqBy(activities, (activity) => activity.coaster.id).map(
    (activity) => activity.coaster
  );
  const parks = _uniqBy(coasters, (coaster) => coaster.park.name).map(
    (coaster) => coaster.park
  );

  return {
    totalCount: activities.length,
    countByCoasterId: _countBy(activities, (activity) => activity.coaster.id),
    countByManufacturer: _countBy(
      activities,
      (activity) => activity.coaster.make
    ),
    countByType: _countBy(activities, (activity) => activity.coaster.type),
    countByPark: _countBy(activities, (activity) => activity.coaster.parkId),
    countByCountry: _countBy(
      activities,
      (activity) => activity.coaster.park.country
    ),

    inversions: totalMinMax(
      activities,
      coasters,
      (coaster) => coaster.inversions
    ),
    duration: totalMinMax(activities, coasters, (coaster) => coaster.duration),
    length: totalMinMax(activities, coasters, (coaster) => coaster.length),
    drop: totalMinMax(activities, coasters, (coaster) => coaster.drop),
    height: minMax(coasters, (coaster) => coaster.height),
    speed: minMax(coasters, (coaster) => coaster.speed),
    verticalAngle: minMax(coasters, (coaster) => coaster.verticalAngle),

    coasters,
    parks,
  };
};

const totalMinMax = (
  activities: CoasterActivity[],
  coasters: CoasterWithPark[],
  getCoasterProperty: (coaster: CoasterWithPark) => number | null | undefined
) => {
  const total = filterAndSum(activities, (activity) =>
    getCoasterProperty(activity.coaster)
  );
  const { min, max } = minMax(coasters, getCoasterProperty);
  return {
    total,
    min: { id: min?.id, value: min ? getCoasterProperty(min) : undefined },
    max: { id: max?.id, value: max ? getCoasterProperty(max) : undefined },
  };
};
