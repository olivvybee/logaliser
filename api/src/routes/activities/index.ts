import { Hono } from 'hono';

import { coasterActivityHandler } from './coaster';
import { recentActivityHandler } from './recent';

export const activitiesHandler = new Hono();

activitiesHandler.route('/coaster', coasterActivityHandler);
activitiesHandler.route('/recent', recentActivityHandler);
