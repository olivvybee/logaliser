export const getNearbyLatLong = (
  latitude: number,
  longitude: number,
  threshold = 0.25
) => ({
  latitude: {
    min: latitude - threshold,
    max: latitude + threshold,
  },
  longitude: {
    min: longitude - threshold,
    max: longitude + threshold,
  },
});
