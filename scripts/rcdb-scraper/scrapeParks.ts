import { load } from 'cheerio';
import { fetchUrl } from './fetchUrl';
import { scrapePaginatedItems } from './pagination';
import { Entity, Filter, getIdFromUrl, getUrl } from './urls';
import { getLocation } from './getLocation';
import { exportHashes, findChangedItems } from './hashing';
import { uploadData } from './uploadData';

interface ScrapeParksArgs {
  filter?: Filter;
  limit?: number;
  forceUpload?: boolean;
}

export const scrapeParks = async ({
  filter,
  limit,
  forceUpload,
}: ScrapeParksArgs) => {
  console.log('Scraping theme parks...');

  const url = getUrl(Entity.Park, filter);
  const parks = await scrapePaginatedItems(url, scrapeParkPage, limit);

  console.log(`Found data for ${parks.length} parks.`);

  const { changedIds, hashes } = findChangedItems(parks, Entity.Park);

  console.log(`${changedIds.length} parks need updating.`);

  const parksToUpload = parks.filter((park) => changedIds.includes(park.id));
  if (parksToUpload.length > 0) {
    await uploadData(Entity.Park, parksToUpload);
  } else if (forceUpload) {
    await uploadData(Entity.Park, parks);
  }

  exportHashes(hashes, Entity.Park);
};

const scrapeParkPage = async (url: string) => {
  const html = await fetchUrl(url);
  const $ = load(html);

  return {
    id: getIdFromUrl(url),
    name: $('#feature h1').text().split(' / ')[0],
    country: $('#feature > div > a:last-of-type').text(),
    ...getLocation($),
  };
};
