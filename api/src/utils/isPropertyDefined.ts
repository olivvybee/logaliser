export const isPropertyDefined = <T>(
  item: T,
  getProperty: (item: T) => number | undefined | null
) => {
  const property = getProperty(item);
  return property !== undefined && property !== null;
};
