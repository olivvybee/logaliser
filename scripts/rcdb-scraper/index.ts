import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { config as loadEnv } from 'dotenv';

import { Filter } from './urls';
import { scrapeCoasters } from './scrapeCoasters';
import { scrapeParks } from './scrapeParks';

loadEnv();

if (!process.env.LOGALISE_DB_API) {
  console.error('LOGALISE_DB_API environment variable is missing');
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
  .parseSync();

const filter = argv.onlyExisting
  ? Filter.Existing
  : argv.onlyDefunct
  ? Filter.Defunct
  : undefined;

const { limit, forceUpload } = argv;

if (argv.entity === 'park') {
  scrapeParks({ filter, limit, forceUpload });
} else {
  scrapeCoasters({ filter, limit, forceUpload });
}
