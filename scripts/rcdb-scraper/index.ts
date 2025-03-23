import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { config as loadEnv } from 'dotenv';

import { Filter } from './urls';
import { scrapeCoasters, scrapeSpecificCoasters } from './scrapeCoasters';
import { scrapeParks, scrapeSpecificParks } from './scrapeParks';

loadEnv();

if (!process.env.LOGALISER_API_URL) {
  console.error('LOGALISER_API_URL environment variable is missing');
  process.exit(1);
}

if (!process.env.LOGALISER_API_KEY) {
  console.error('LOGALISER_API_KEY environment variable is missing');
  process.exit(1);
}

const argv = yargs(hideBin(process.argv))
  .option('entity', {
    alias: 'e',
    type: 'string',
    choices: ['coaster', 'park'],
    default: 'coaster',
  })
  .option('only-existing', {
    type: 'boolean',
    default: false,
  })
  .option('only-defunct', {
    type: 'boolean',
    default: false,
  })
  .option('limit', {
    type: 'number',
  })
  .option('forceUpload', {
    type: 'boolean',
    default: false,
  })
  .option('ids', {
    alias: 'i',
    type: 'array',
    default: [],
  })
  .parseSync();

const filter = argv.onlyExisting
  ? Filter.Existing
  : argv.onlyDefunct
  ? Filter.Defunct
  : undefined;

const { limit, forceUpload, ids } = argv;

if (argv.entity === 'park') {
  if (ids) {
    scrapeSpecificParks(ids);
  } else {
    scrapeParks({ filter, limit, forceUpload });
  }
} else {
  if (ids) {
    scrapeSpecificCoasters(ids);
  } else {
    scrapeCoasters({ filter, limit, forceUpload });
  }
}
