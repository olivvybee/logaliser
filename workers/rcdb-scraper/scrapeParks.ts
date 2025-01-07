import { load } from 'cheerio';
import { fetchUrl } from './fetchUrl';
import { scrapePaginatedItems } from './pagination';
import { Entity, Filter, getIdFromUrl, getUrl } from './urls';
import { getLocation } from './getLocation';
import { exportHashes, findChangedItems } from './hashing';
import { uploadData } from './uploadData';

export const scrapeParks = async (filter?: Filter) => {
  console.log('Scraping theme parks...');

  const url = getUrl(Entity.Park, filter);
  const parks = await scrapePaginatedItems(url, scrapeParkPage);

  console.log(`Found data for ${parks.length} parks.`);

  const { changedIds, hashes } = findChangedItems(parks, Entity.Park);

  console.log(`${changedIds.length} parks need updating.`);

  const parksToUpload = parks.filter((park) => changedIds.includes(park.id));
  if (parksToUpload.length > 0) {
    await uploadData(Entity.Park, parksToUpload);
  }

  exportHashes(hashes, Entity.Park);
};

const scrapeParkPage = async (url: string) => {
  const html = await fetchUrl(url);
  const $ = load(html);

  return {
    id: getIdFromUrl(url),
    name: $('#feature h1').text(),
    country: $('#feature > div > a:last-of-type').text(),
    ...getLocation($),
  };
};
