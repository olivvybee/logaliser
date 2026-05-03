import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { config as loadEnv } from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Station } from '@logaliser/api';

interface UploadResponse {
  successfulUpdates: Station[];
  failedUpdates: Array<{ data: Station; error: Error }>;
}

const uploadData = async (stations: Partial<Station>[]) => {
  const url = `${process.env.LOGALISER_API_URL}/stations/import`;
  const apiKey = process.env.LOGALISER_API_KEY;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(stations),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    process.exit(1);
  }

  const result = (await response.json()) as UploadResponse;
  console.log(`Successful updates: ${result.successfulUpdates.length}`);
  console.log(`Failed updates: ${result.failedUpdates.length}`);
  result.failedUpdates.forEach((failedUpdate) => {
    console.error(JSON.stringify(failedUpdate, null, 2));
  });
};

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
  .option('file', {
    alias: 'f',
    type: 'string',
    demandOption: true,
  })
  .parseSync();

if (!argv.file) {
  console.error('A csv file must be provided using the -f option');
  process.exit(1);
}

const filePath = path.resolve(argv.file);
const fileContent = fs.readFileSync(filePath, 'utf-8');

const lines = fileContent.split('\n');

const headers = lines[0].split(',').map((header) => header.toLowerCase());

const nameIndex = headers.findIndex((header) =>
  ['name', 'station'].includes(header)
);
const latitudeIndex = headers.findIndex((header) =>
  ['latitude', 'lat'].includes(header)
);
const longitudeIndex = headers.findIndex((header) =>
  ['longitude', 'long', 'lng'].includes(header)
);

if ([nameIndex, latitudeIndex, longitudeIndex].includes(-1)) {
  console.error('Failed to parse header row');
  process.exit(1);
}

const stations = lines
  .slice(1)
  .map((line, index) => {
    const values = line.split(',');
    const name = values[nameIndex];
    const latitude = parseFloat(values[latitudeIndex]);
    const longitude = parseFloat(values[longitudeIndex]);

    if (!name || isNaN(latitude) || isNaN(longitude)) {
      console.log(`Failed to parse row ${index + 1}`);
      return undefined;
    }

    return {
      name,
      latitude,
      longitude,
      country: 'United Kingdom',
    };
  })
  .filter((station) => station !== undefined);

uploadData(stations);
