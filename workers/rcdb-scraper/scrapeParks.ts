import { Entity, Filter, getUrl } from './urls';

export const scrapeParks = async (filter?: Filter) => {
  const url = getUrl(Entity.Coaster, filter);
};
