import { load } from 'cheerio';

import { makeRequest } from './makeRequest';
import { buildUrl, getIdFromUrl } from './utils';
import { getLocation } from './getLocation';
import { getDB } from '../../db';
import { updateCoaster } from './updateCoaster';

export const updatePark = async (id: number) => {
  const db = getDB();

  const url = buildUrl(`${id}.htm`);
  const response = await makeRequest(url);
  const $ = load(response);

  const data = {
    name: $('#feature h1').text().split(' / ')[0],
    country: $('#feature > div > a:last-of-type').text(),
    ...getLocation($),
  };

  const coasterIds = $('h4 ~ div > table tr td:nth-child(2) a')
    .map((_, link) => getIdFromUrl(link.attribs.href))
    .toArray();

  const coasters = await Promise.all(coasterIds.map(updateCoaster));

  const park = await db.themePark.upsert({
    where: {
      id,
    },
    update: data,
    create: { id, ...data },
  });

  return { ...park, coasters };
};
