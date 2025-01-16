import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { config as loadEnv } from 'dotenv';

import { themeParksHandler } from './routes/theme-parks';
import { coastersHandler } from './routes/coasters';
import { activitiesHandler } from './routes/activities';

loadEnv();
const PORT = Number(process.env.PORT) || 3000;

const app = new Hono();

app.use(logger());
app.use(prettyJSON());

app.route('/activities', activitiesHandler);
app.route('/coasters', coastersHandler);
app.route('/theme-parks', themeParksHandler);

serve(
  {
    ...app,
    port: PORT,
  },
  (info) => {
    console.log(`Server started at http://localhost:${info.port}`);
  }
);
