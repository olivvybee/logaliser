export const getDistance = (
  latA: number,
  lngA: number,
  latB: number,
  lngB: number
) => Math.sqrt(Math.pow(latA - latB, 2) + Math.pow(lngA - lngB, 2));
