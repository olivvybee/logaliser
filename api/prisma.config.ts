import path from 'path';
import { defineConfig, env } from 'prisma/config';
import { config as loadEnv } from 'dotenv';

loadEnv();

export default defineConfig({
  schema: path.join('prisma'),
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
