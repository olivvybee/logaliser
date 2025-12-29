import _uniq from 'lodash/uniq';
import _uniqBy from 'lodash/uniqBy';
import _groupBy from 'lodash/groupBy';
import _sumBy from 'lodash/sumBy';
import _minBy from 'lodash/minBy';
import _maxBy from 'lodash/maxBy';
import _countBy from 'lodash/countBy';
import { eachDayOfInterval, eachMonthOfInterval, formatDate } from 'date-fns';

import { minMax } from '../../utils/minMax';
import { filterAndSum } from '../../utils/filterAndSum';
import { getDay, getMonth } from '../../utils/activityDates';
import { highestSumPerDay } from '../../utils/highestSumPerDay';
import { ConcreteCoasterActivity, CoasterWithPark } from '../../db/types';

import { TotalMinMax } from '../types';

import { CoasterStats } from './types';

export const calculateCoasterStats = (
  activities: ConcreteCoasterActivity[],
  startDate: Date,
  endDate: Date
): CoasterStats => {
  const coasters = _uniqBy(
    activities,
    (activity) => activity.coasterActivity.coaster.id
  ).map((activity) => activity.coasterActivity.coaster);
  const parks = _uniqBy(coasters, (coaster) => coaster.parkId).map(
    (coaster) => coaster.park
  );

  const firstRides = activities.filter(
    (activity) => activity.coasterActivity.firstRide
  );
  const inShowExits = activities.filter(
    (activity) => activity.coasterActivity.inShowExit
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
    countByCoasterId: _countBy(
      activities,
      (activity) => activity.coasterActivity.coaster.id
    ),
    countByManufacturer: _countBy(
      activities,
      (activity) => activity.coasterActivity.coaster.make
    ),
    countByType: _countBy(
      activities,
      (activity) => activity.coasterActivity.coaster.type
    ),
    countByParkId: _countBy(
      activities,
      (activity) => activity.coasterActivity.coaster.parkId
    ),
    countByCountry: _countBy(
      activities,
      (activity) => activity.coasterActivity.coaster.park.country
    ),

    countByDay: allDays.reduce(
      (processed, day) => {
        processed[day] = activities.filter(
          (activity) => getDay(activity) === day
        ).length;
        return processed;
      },
      {} as Record<string, number>
    ),
    countByMonth: allMonths.reduce(
      (processed, month) => {
        processed[month] = activities.filter(
          (activity) => getMonth(activity) === month
        ).length;
        return processed;
      },
      {} as Record<string, number>
    ),

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

    newCoasters: {
      total: firstRides.length,
      coasters: firstRides.map(
        (activity) => activity.coasterActivity.coaster.id
      ),
    },
    inShowExits: {
      total: inShowExits.length,
      countByCoasterId: _countBy(
        inShowExits,
        (activity) => activity.coasterActivity.coaster.id
      ),
    },

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
  activities: ConcreteCoasterActivity[],
  coasters: CoasterWithPark[],
  getCoasterProperty: (coaster: CoasterWithPark) => number | null | undefined
): TotalMinMax => {
  const total = filterAndSum(activities, (activity) =>
    getCoasterProperty(activity.coasterActivity.coaster)
  );

  const { min, max } = minMax(coasters, getCoasterProperty);
  const minValue = min ? getCoasterProperty(min) : undefined;
  const maxValue = max ? getCoasterProperty(max) : undefined;

  const highestDay = highestSumPerDay(activities, (activity) =>
    getCoasterProperty(activity.coasterActivity.coaster)
  );

  return {
    total,
    min: min && minValue ? { id: min.id, value: minValue } : undefined,
    max: max && maxValue ? { id: max.id, value: maxValue } : undefined,
    highestDay,
  };
};
