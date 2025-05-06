import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import { config as loadEnv } from 'dotenv';

import { themeParksHandler } from './routes/theme-parks';
import { coastersHandler } from './routes/coasters';
import { activitiesHandler } from './routes/activities';
import { authMiddleware } from './middleware/authMiddleware';
import { checkCorsOrigin } from './utils/checkCorsOrigin';
import { statsHandler } from './routes/stats';
import { stationsHandler } from './routes/stations';

loadEnv();
const PORT = Number(process.env.PORT) || 3000;
const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(';');

const app = new Hono();

app.use(logger());
app.use(prettyJSON());
app.use(
  cors({
    origin: CORS_ORIGINS || checkCorsOrigin,
  })
);

app.route('/activities', activitiesHandler);
app.route('/coasters', coastersHandler);
app.route('/theme-parks', themeParksHandler);
app.route('/stations', stationsHandler);
app.route('/stats', statsHandler);

app.get('/auth', authMiddleware, async (ctx) => {
  return ctx.json({ valid: true });
});

serve(
  {
    ...app,
    port: PORT,
  },
  (info) => {
    console.log(`Server started at http://localhost:${info.port}`);
  }
);
