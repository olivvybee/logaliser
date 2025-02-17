import { isPropertyDefined } from './isPropertyDefined';

export const filterAndSum = <T>(
  items: T[],
  getProperty: (item: T) => number | undefined | null
) => {
  if (!items.some((item) => isPropertyDefined(item, getProperty))) {
    return undefined;
  }

  return items.reduce((sum, item) => {
    const property = getProperty(item);
    if (property !== undefined && property !== null) {
      return sum + property;
    }
    return sum;
  }, 0);
};
