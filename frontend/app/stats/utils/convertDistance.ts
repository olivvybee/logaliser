export const metersToFeet = (meters: number) => Math.round(meters * 3.28084);

export const metersToMiles = (meters: number) => {
  const miles = meters / 1609;
  return Math.round(miles * 100) / 100;
};

export const kmToMiles = (km: number) => {
  const miles = km / 1.609;
  return Math.round(miles * 10) / 10;
};
