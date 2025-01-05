import { load } from 'cheerio';
import { Presets, SingleBar } from 'cli-progress';

import { fetchUrl } from './fetchUrl';
import { buildUrl } from './urls';

const getItemUrlsForPage = (html: string) => {
  const $ = load(html);

  const links = $('.stdtbl.rer tbody tr td:nth-of-type(2) a');

  const urls = [];
  for (let i = 0; i < links.length; i++) {
    const url = buildUrl(links[i].attribs.href);
    urls.push(url);
  }
  return urls;
};

export const scrapePaginatedItems = async <T>(
  url: string,
  scrapeItem: (url: string) => Promise<T>
) => {
  const progressBar = new SingleBar({}, Presets.shades_classic);

  const html = await fetchUrl(url);
  const $ = load(html);

  const totalItemCount =
    parseInt($('.int').text()) ||
    parseInt($('table.t-list tr:nth-child(2) td:nth-child(2)').text());

  const lastPageLink = $('#rfoot a:nth-of-type(3)');
  const pageCount = parseInt(lastPageLink.text());

  progressBar.start(totalItemCount, 0);

  const items: T[] = [];

  for (let page = 1; page <= 1; page++) {
    const pageUrl = `${url}&page=${page}`;
    const pageHtml = await fetchUrl(pageUrl);
    const itemUrls = getItemUrlsForPage(pageHtml);

    for (let i = 0; i < itemUrls.length; i++) {
      const url = itemUrls[i];
      const item = await scrapeItem(url);
      items.push(item);
      progressBar.increment();
    }
  }

  progressBar.stop();

  return items;
};