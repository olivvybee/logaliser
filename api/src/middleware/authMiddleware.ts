import { bearerAuth } from 'hono/bearer-auth';
import { createMiddleware } from 'hono/factory';

export const authMiddleware = createMiddleware(async (ctx, next) => {
  const token = process.env.API_KEY;
  if (!token) {
    return ctx.json({ error: 'API_KEY environment variable not set' }, 500);
  }

  const auth = bearerAuth({ token });
  return auth(ctx, next);
});
