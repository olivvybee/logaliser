import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { themeParksHandler } from './themeParks';

const app = new Hono<{ Bindings: Env }>();

app.use(prettyJSON());
app.use(logger());

app.route('/theme-parks', themeParksHandler);

export default app;
