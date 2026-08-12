import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { AuthorizationCode, ModuleOptions } from 'simple-oauth2';
import { config as loadEnv } from 'dotenv';

import { getDB } from '../../db';
import { OauthToken } from '../../__generated__/prisma/client';
import { USER_AGENT } from '../../apis/apis.constants';

import { OauthTokenType } from './auth.types';
import { TraewellingClient } from '../../apis/traewelling/client';

loadEnv();

const OAUTH_CONFIG: ModuleOptions = {
  auth: {
    tokenHost: 'https://traewelling.de',
  },
  client: {
    id: process.env.TRAEWELLING_CLIENT_ID || '',
    secret: process.env.TRAEWELLING_CLIENT_SECRET || '',
  },
  http: {
    headers: {
      'User-Agent': USER_AGENT,
    },
  },
};

const SCOPES = ['read-search', 'write-statuses'];

export const traewellingHandler = new Hono();

traewellingHandler.get(
  '/status',
  zValidator('query', z.object({ redirectUri: z.string() })),
  async (ctx) => {
    const db = getDB();

    const existingToken = await db.oauthToken.findUnique({
      where: {
        id: OauthTokenType.Traewelling,
      },
    });

    const user = existingToken?.accessToken
      ? await new TraewellingClient(existingToken.accessToken).user()
      : null;

    const client = new AuthorizationCode(OAUTH_CONFIG);
    const authUrl = client.authorizeURL({
      redirect_uri: ctx.req.valid('query').redirectUri,
      scope: SCOPES,
    });

    return ctx.json({
      connected: !!existingToken,
      user,
      authUrl,
    });
  }
);

traewellingHandler.post(
  '/code',
  zValidator('json', z.object({ code: z.string(), redirectUri: z.string() })),
  async (ctx) => {
    const db = getDB();

    const { code, redirectUri } = ctx.req.valid('json');

    const client = new AuthorizationCode(OAUTH_CONFIG);

    try {
      const token = await client.getToken(
        {
          code,
          redirect_uri: redirectUri,
          scope: SCOPES,
        },
        { json: true }
      );

      const tokenData: OauthToken = {
        id: OauthTokenType.Traewelling,
        accessToken: token.token.access_token as string,
        refreshToken: token.token.refresh_token as string,
        expiresAt: token.token.expires_at as Date,
      };

      const authToken = await db.oauthToken.upsert({
        where: {
          id: OauthTokenType.Traewelling,
        },
        create: tokenData,
        update: tokenData,
      });

      return ctx.json({
        authToken,
      });
    } catch (err) {
      const error = err as Error;
      return ctx.json({ error: error.message }, 500);
    }
  }
);
