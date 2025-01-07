import { CheerioAPI } from 'cheerio';

export const getLocation = ($: CheerioAPI) => {
  const mapLink =
    $('.map-tpl a[href^="https://www.google.com/maps/place"]').attr('href') ||
    '';
  const splitMapLink = mapLink.split('/');
  const placeIndex = splitMapLink.indexOf('place');
  const coords = splitMapLink[placeIndex + 1];
  const [lat, lng] = coords.split(',');
  return {
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
  };
};
