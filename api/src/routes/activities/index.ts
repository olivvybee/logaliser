import { Hono } from 'hono';

import { coasterActivityHandler } from './coaster';

export const activitiesHandler = new Hono();

activitiesHandler.route('/coaster', coasterActivityHandler);
