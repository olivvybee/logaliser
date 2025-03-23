import { Cheerio, CheerioAPI, load } from 'cheerio';
import { fetchUrl } from './fetchUrl';
import { scrapePaginatedItems } from './pagination';
import { Entity, Filter, getIdFromUrl, getUrl } from './urls';
import { toCamelCase } from './toCamelCase';
import { exportHashes, findChangedItems } from './hashing';
import { getLocation } from './getLocation';
import { uploadData } from './uploadData';

interface ScrapeCoastersArgs {
  filter?: Filter;
  limit?: number;
  forceUpload?: boolean;
}

export const scrapeCoasters = async ({
  filter,
  limit,
  forceUpload,
}: ScrapeCoastersArgs) => {
  console.log('Scraping coasters...');

  const url = getUrl(Entity.Coaster, filter);
  const coasters = await scrapePaginatedItems(url, scrapeCoasterPage, limit);

  console.log(`Found data for ${coasters.length} coasters.`);

  const { changedIds, hashes } = findChangedItems(coasters, Entity.Coaster);

  console.log(`${changedIds.length} coasters need updating.`);

  const coastersToUpload = coasters.filter((coaster) =>
    changedIds.includes(coaster.id)
  );
  if (coastersToUpload.length > 0) {
    await uploadData(Entity.Coaster, coastersToUpload);
  } else if (forceUpload) {
    await uploadData(Entity.Coaster, coasters);
  }

  exportHashes(hashes, Entity.Coaster);
};

const scrapeCoasterPage = async (url: string) => {
  const html = await fetchUrl(url);
  const $ = load(html);

  const status = $('#feature time[datetime]').prev().text();
  const previousStatuses = getPreviousStatuses($);

  const opened = ['Operating', 'Under Construction'].includes(status)
    ? $('#feature time[datetime]').prop('datetime')
    : getEarliestOperatedDate(previousStatuses || []);

  const make = $('#feature .scroll:nth-of-type(2) a:nth-of-type(1)').text();
  const shortMake = getShortManufacturerName(make);

  return {
    id: getIdFromUrl(url),
    name: $('#feature h1').text().split(' / ')[0],
    parkId: getIdFromUrl(
      $('#feature > div > a:nth-of-type(1)').prop('href') || ''
    ),
    opened,
    status,
    previousStatuses,
    make: shortMake,
    model: $('#feature .scroll:nth-of-type(2) a:nth-of-type(2)').text(),
    type: $(
      '#feature ul:nth-of-type(1) > li:nth-of-type(2) a:nth-of-type(1)'
    ).text(),
    design: $(
      '#feature ul:nth-of-type(1) > li:nth-of-type(3) a:nth-of-type(1)'
    ).text(),
    ...getLocation($),
    ...getCoasterStats($),
  };
};

const NUMERIC_STATS = [
  'Length',
  'Height',
  'Speed',
  'Inversions',
  'Vertical Angle',
  'Drop',
];
const TIME_STATS = ['Duration'];
const IGNORE_STATS = ['Former status', 'Name'];

const getStatValue = (key: string, value: Cheerio<any>, $: CheerioAPI) => {
  if (NUMERIC_STATS.includes(key)) {
    return parseFloat(value.text());
  }

  if (TIME_STATS.includes(key)) {
    const [minutes, seconds] = value.text().split(':');
    return parseInt(minutes) * 60 + parseInt(seconds);
  }

  const listElements = value.find('li');
  if (listElements.length > 0) {
    return listElements.map((_, element) => $(element).text()).toArray();
  }

  if (value.find('br').length > 0) {
    value.find('br').replaceWith('\n');
    return value
      .text()
      .split('\n')
      .filter((str) => !!str)
      .map((str) => str.replace(' ( to )', ''));
  }

  return value.text();
};

const getCoasterStats = ($: CheerioAPI) =>
  $('table.stat-tbl tr')
    .map((_, element) => {
      const key = $(element).find('th').text();
      const valueElement = $(element).find('td');

      return {
        key,
        value: getStatValue(key, valueElement, $),
      };
    })
    .get()
    .filter((stat) => !IGNORE_STATS.includes(stat.key))
    .reduce(
      (obj, item) => ({
        ...obj,
        [toCamelCase(item.key)]: item.value,
      }),
      {}
    );

interface Status {
  status?: string;
  during?: string;
  from?: string;
  to?: string;
}

const getPreviousStatuses = ($: CheerioAPI) => {
  const headerCell = $('table.stat-tbl th:contains("Former status")');
  const hasPreviousStatuses = headerCell.length > 0;
  if (!hasPreviousStatuses) {
    return undefined;
  }

  const dataCell = headerCell.next();

  const statuses: Status[] = [];
  let status: Status = {};

  dataCell.children().each((_, element) => {
    if (element.tagName === 'a') {
      status.status = $(element).text();
    }

    if (element.tagName === 'time') {
      if (!status.from) {
        status.from = element.attribs.datetime;
      } else {
        status.to = element.attribs.datetime;
      }
    }

    if (element.tagName === 'br') {
      if (status.from && !status.to) {
        status.during = status.from;
        status.from = undefined;
      }

      statuses.push(status);
      status = {};
    }
  });

  if (statuses.length === 0 && status.from) {
    if (status.from && !status.to) {
      status.during = status.from;
      status.from = undefined;
    }

    statuses.push(status);
  }

  return statuses;
};

const getEarliestOperatedDate = (previousStatuses: Status[]) => {
  const operatedStatuses = previousStatuses.filter(
    (status) => status.status === 'Operated'
  );
  if (!operatedStatuses.length) {
    return undefined;
  }
  operatedStatuses.sort((a, b) =>
    (a.from || a.during || '') < (b.from || b.during || '') ? -1 : 1
  );
  return operatedStatuses[0].from || operatedStatuses[0].during;
};

const getShortManufacturerName = (manufacturer: string) => {
  switch (manufacturer) {
    case 'Arrow Dynamics':
      return 'Arrow';

    case 'Bolliger & Mabillard':
      return 'B&M';

    case 'Custom Coasters International, Inc.':
      return 'CCI';

    case 'Gerstlauer Amusement Rides GmbH':
      return 'Gerstlauer';

    case 'Great Coasters International':
      return 'GCI';

    case 'Intamin Amusement Rides':
    case 'Intamin AG':
      return 'Intamin';

    case 'Mack Rides GmbH & Co KG':
      return 'Mack';

    case 'Maurer Rides GmbH':
      return 'Maurer';

    case 'Rocky Mountain Construction':
      return 'RMC';

    case 'Roller Coaster Corporation of America':
      return 'RCCA';

    case 'S&S Worldwide':
      return 'S&S';

    default:
      return manufacturer;
  }
};
