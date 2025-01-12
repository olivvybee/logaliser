import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { themeParksHandler } from './themeParks';
import { coastersHandler } from './coasters';

const app = new Hono<{ Bindings: Env }>();

app.use(prettyJSON());
app.use(logger());

app.route('/theme-parks', themeParksHandler);
app.route('/coasters', coastersHandler);

export default app;
