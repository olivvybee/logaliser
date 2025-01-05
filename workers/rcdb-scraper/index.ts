import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Filter } from './urls';
import { scrapeCoasters } from './scrapeCoasters';
import { scrapeParks } from './scrapeParks';

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
  .parseSync();

const filter = argv.onlyExisting
  ? Filter.Existing
  : argv.onlyDefunct
  ? Filter.Defunct
  : undefined;

if (argv.entity === 'park') {
  scrapeParks(filter);
} else {
  scrapeCoasters(filter);
}
