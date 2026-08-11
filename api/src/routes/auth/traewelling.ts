import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { AuthorizationCode, ModuleOptions } from 'simple-oauth2';
import { config as loadEnv } from 'dotenv';

loadEnv();

const OAUTH_CONFIG: ModuleOptions = {
  auth: {
    tokenHost: 'https://traewelling.de',
  },
  client: {
    id: process.env.TRAEWELLING_CLIENT_ID || '',
    secret: process.env.TRAEWELLING_CLIENT_SECRET || '',
  },
};

const SCOPES = ['read-search', 'write-statuses'];

export const traewellingHandler = new Hono();

traewellingHandler.get(
  '/status',
  zValidator('query', z.object({ redirectUri: z.string() })),
  async (ctx) => {
    const client = new AuthorizationCode(OAUTH_CONFIG);
    const authUrl = client.authorizeURL({
      redirect_uri: ctx.req.valid('query').redirectUri,
      scope: SCOPES,
    });

    return ctx.json({
      authUrl,
    });
  }
);
