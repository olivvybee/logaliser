import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import { themeParksHandler } from './routes/theme-parks';
import { coastersHandler } from './routes/coasters';
import { activitiesHandler } from './routes/activities';

const app = new Hono();

app.use(logger());
app.use(prettyJSON());

app.route('/activities', activitiesHandler);
app.route('/coasters', coastersHandler);
app.route('/theme-parks', themeParksHandler);

serve(app, (info) => {
  console.log(`Server started at http://localhost:${info.port}`);
});
