import { CoasterActivity, CoasterWithPark } from '@/db/types';
import _uniq from 'lodash/uniq';
import _uniqBy from 'lodash/uniqBy';
import _groupBy from 'lodash/groupBy';
import _sumBy from 'lodash/sumBy';
import _minBy from 'lodash/minBy';
import _maxBy from 'lodash/maxBy';
import _countBy from 'lodash/countBy';
import { minMax } from '@/utils/minMax';
import { filterAndSum } from '@/utils/filterAndSum';
import { eachDayOfInterval, eachMonthOfInterval, formatDate } from 'date-fns';
import { getDay, getMonth } from '@/utils/activityDates';
import { highestSumPerDay } from '@/utils/highestSumPerDay';
import { CoasterStats } from './types';
import { TotalMinMax } from '../types';

export const calculateCoasterStats = (
  activities: CoasterActivity[],
  startDate: Date,
  endDate: Date
): CoasterStats => {
  const coasters = _uniqBy(activities, (activity) => activity.coaster.id).map(
    (activity) => activity.coaster
  );
  const parks = _uniqBy(coasters, (coaster) => coaster.parkId).map(
    (coaster) => coaster.park
  );

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).map((date) => formatDate(date, 'yyyy-MM-dd'));

  const allMonths = eachMonthOfInterval({
    start: startDate,
    end: endDate,
  }).map((date) => formatDate(date, 'yyyy-MM'));

  return {
    totalCount: activities.length,
    countByCoasterId: _countBy(activities, (activity) => activity.coaster.id),
    countByManufacturer: _countBy(
      activities,
      (activity) => activity.coaster.make
    ),
    countByType: _countBy(activities, (activity) => activity.coaster.type),
    countByParkId: _countBy(activities, (activity) => activity.coaster.parkId),
    countByCountry: _countBy(
      activities,
      (activity) => activity.coaster.park.country
    ),

    countByDay: allDays.reduce((processed, day) => {
      processed[day] = activities.filter(
        (activity) => getDay(activity) === day
      ).length;
      return processed;
    }, {} as Record<string, number>),
    countByMonth: allMonths.reduce((processed, month) => {
      processed[month] = activities.filter(
        (activity) => getMonth(activity) === month
      ).length;
      return processed;
    }, {} as Record<string, number>),

    inversions: totalMinMax(
      activities,
      coasters,
      (coaster) => coaster.inversions
    ),
    duration: totalMinMax(activities, coasters, (coaster) => coaster.duration),
    length: totalMinMax(activities, coasters, (coaster) => coaster.length),
    drop: totalMinMax(activities, coasters, (coaster) => coaster.drop),
    height: totalMinMax(activities, coasters, (coaster) => coaster.height),
    speed: totalMinMax(activities, coasters, (coaster) => coaster.speed),
    verticalAngle: totalMinMax(
      activities,
      coasters,
      (coaster) => coaster.verticalAngle
    ),

    coasters,
    parks,

    coastersWithMissingData: coasters
      .filter((coaster) =>
        [
          coaster.duration,
          coaster.height,
          coaster.inversions,
          coaster.length,
          coaster.make,
          coaster.speed,
        ].some((stat) => stat === null)
      )
      .map((coaster) => coaster.id),
  };
};

const totalMinMax = (
  activities: CoasterActivity[],
  coasters: CoasterWithPark[],
  getCoasterProperty: (coaster: CoasterWithPark) => number | null | undefined
): TotalMinMax => {
  const total = filterAndSum(activities, (activity) =>
    getCoasterProperty(activity.coaster)
  );

  const { min, max } = minMax(coasters, getCoasterProperty);
  const minValue = min ? getCoasterProperty(min) : undefined;
  const maxValue = max ? getCoasterProperty(max) : undefined;

  const highestDay = highestSumPerDay(activities, (activity) =>
    getCoasterProperty(activity.coaster)
  );

  return {
    total,
    min: min && minValue ? { id: min.id, value: minValue } : undefined,
    max: max && maxValue ? { id: max.id, value: maxValue } : undefined,
    highestDay,
  };
};
