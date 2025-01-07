import { load } from 'cheerio';
import { fetchUrl } from './fetchUrl';
import { scrapePaginatedItems } from './pagination';
import { Entity, Filter, getIdFromUrl, getUrl } from './urls';
import { getLocation } from './getLocation';
import { findChangedItems } from './hashing';

export const scrapeParks = async (filter?: Filter) => {
  const url = getUrl(Entity.Park, filter);
  const parks = await scrapePaginatedItems(url, scrapeParkPage);

  console.log(JSON.stringify(parks, null, 2));
  console.log(parks.length);

  const changedParkIds = findChangedItems(parks, Entity.Park);
};

const scrapeParkPage = async (url: string) => {
  const html = await fetchUrl(url);
  const $ = load(html);

  return {
    id: getIdFromUrl(url),
    name: $('#feature h1').text(),
    country: $('#feature > div > a:last-of-type').text(),
    location: getLocation($),
  };
};
