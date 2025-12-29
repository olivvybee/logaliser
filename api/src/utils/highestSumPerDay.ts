import { Activity } from '@prisma/client';
import _maxBy from 'lodash/maxBy';
import { isPropertyDefined } from './isPropertyDefined';
import { getDay } from './activityDates';

export const highestSumPerDay = <T extends Activity>(
  activities: T[],
  getProperty: (item: T) => number | undefined | null
) => {
  if (
    !activities.some((activity) => isPropertyDefined(activity, getProperty))
  ) {
    return undefined;
  }

  const sumPerDay = activities.reduce(
    (processed, activity) => {
      const value = getProperty(activity);
      if (!value) {
        return processed;
      }

      const day = getDay(activity);

      if (processed[day]) {
        processed[day] += value;
      } else {
        processed[day] = value;
      }

      return processed;
    },
    {} as Record<string, number>
  );

  const highestDay = _maxBy(Object.entries(sumPerDay), ([day, value]) => value);

  if (highestDay) {
    const [day, value] = highestDay;
    return { day, value };
  } else {
    return undefined;
  }
};
