import path from 'path';
import type { PrismaConfig } from 'prisma';
import { config as loadEnv } from 'dotenv';

loadEnv();

export default {
  schema: path.join('prisma'),
} satisfies PrismaConfig;
