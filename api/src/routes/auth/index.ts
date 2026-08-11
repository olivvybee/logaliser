import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/authMiddleware';

export const authHandler = new Hono();

authHandler.get('/', authMiddleware, async (ctx) => {
  return ctx.json({ valid: true });
});
