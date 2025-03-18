import { createMiddleware } from 'hono/factory';

export const softAuthMiddleware = createMiddleware<{
  Variables: {
    isAuthenticated: boolean;
  };
}>(async (ctx, next) => {
  const token = process.env.API_KEY;
  if (!token) {
    return ctx.json({ error: 'API_KEY environment variable not set' }, 500);
  }

  const expectedHeader = `Bearer ${token}`;

  const header = ctx.req.header('Authorization');
  if (header === expectedHeader) {
    ctx.set('isAuthenticated', true);
  }

  await next();
});
