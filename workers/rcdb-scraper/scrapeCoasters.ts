import { Cheerio, CheerioAPI, load } from 'cheerio';
import { fetchUrl } from './fetchUrl';
import { scrapePaginatedItems } from './pagination';
import { Entity, Filter, getIdFromUrl, getUrl } from './urls';
import { toCamelCase } from './toCamelCase';
import { findChangedItems } from './hashing';
import { getLocation } from './getLocation';

export const scrapeCoasters = async (filter?: Filter) => {
  const url = getUrl(Entity.Coaster, filter) + `&ol=26088`;
  const coasters = await scrapePaginatedItems(url, scrapeCoasterPage);

  console.log(JSON.stringify(coasters, null, 2));

  const changedCoasterIds = findChangedItems(coasters, Entity.Coaster);

  // TODO: Shove them into a database
};

const scrapeCoasterPage = async (url: string) => {
  const html = await fetchUrl(url);
  const $ = load(html);

  const status = $('#feature time[datetime]').prev().text();
  const previousStatuses = getPreviousStatuses($);

  const opened =
    status === 'Operating'
      ? $('#feature time[datetime]').prop('datetime')
      : getEarliestOperatedDate(previousStatuses || []);

  return {
    id: getIdFromUrl(url),
    name: $('#feature h1').text(),
    parkId: getIdFromUrl(
      $('#feature > div > a:nth-of-type(1)').prop('href') || ''
    ),
    opened,
    status,
    previousStatuses,
    make: $('#feature .scroll:nth-of-type(2) a:nth-of-type(1)').text(),
    model: $('#feature .scroll:nth-of-type(2) a:nth-of-type(2)').text(),
    type: $(
      '#feature ul:nth-of-type(1) > li:nth-of-type(2) a:nth-of-type(1)'
    ).text(),
    design: $(
      '#feature ul:nth-of-type(1) > li:nth-of-type(3) a:nth-of-type(1)'
    ).text(),
    location: getLocation($),
    ...getCoasterStats($),
  };
};

const NUMERIC_STATS = ['Length', 'Height', 'Speed', 'Inversions'];
const TIME_STATS = ['Duration'];
const IGNORE_STATS = ['Former status'];

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

  return statuses;
};

const getEarliestOperatedDate = (previousStatuses: Status[]) => {
  const operatedStatuses = previousStatuses.filter(
    (status) => status.status === 'Operated'
  );
  operatedStatuses.sort((a, b) =>
    (a.from || a.during || '') < (b.from || b.during || '') ? -1 : 1
  );
  return operatedStatuses[0].from || operatedStatuses[0].during;
};
