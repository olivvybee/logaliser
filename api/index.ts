import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (ctx) => ctx.json({ result: 'Hello world' }));

serve(app, (info) => {
  console.log(info);
  console.log(`Server started at http://localhost:${info.port}`);
});
