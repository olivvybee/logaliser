import { config as loadEnv } from 'dotenv';
import { importStations } from './importStations';

loadEnv();

if (!process.env.LOGALISER_API_URL) {
  console.error('LOGALISER_API_URL environment variable is missing');
  process.exit(1);
}

if (!process.env.LOGALISER_API_KEY) {
  console.error('LOGALISER_API_KEY environment variable is missing');
  process.exit(1);
}

importStations();
