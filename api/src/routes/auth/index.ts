import { Hono } from 'hono';
import { traewellingHandler } from './traewelling';
import { authMiddleware } from '../../middleware/authMiddleware';

export const authHandler = new Hono();

authHandler.route('/traewelling', traewellingHandler);

authHandler.get('/', authMiddleware, async (ctx) => {
  return ctx.json({ valid: true });
});
