export const getNearbyLatLong = (latitude: number, longitude: number) => ({
  latitude: {
    min: latitude - 0.25,
    max: latitude + 0.25,
  },
  longitude: {
    min: longitude - 0.25,
    max: longitude + 0.25,
  },
});
