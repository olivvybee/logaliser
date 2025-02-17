import _minBy from 'lodash/minBy';
import _maxBy from 'lodash/maxBy';

export const minMax = <T>(
  items: T[],
  getProperty: (item: T) => number | null | undefined
) => {
  const min = _minBy(items, getProperty);
  const max = _maxBy(items, getProperty);

  return {
    min,
    max,
  };
};
