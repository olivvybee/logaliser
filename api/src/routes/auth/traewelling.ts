import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { getDB } from '../../db';
import { OauthToken } from '../../__generated__/prisma/client';

import { OauthTokenType } from './auth.types';
import { TraewellingClient } from '../../dataSources/traewelling/client';
import {
  getAuthUrl,
  getTokenFromCode,
  refreshToken,
} from '../../dataSources/traewelling/auth';
import { AccessToken } from 'simple-oauth2';

export const traewellingHandler = new Hono();

const createDBTokenData = (token: AccessToken): OauthToken => ({
  id: OauthTokenType.Traewelling,
  accessToken: token.token.access_token as string,
  refreshToken: token.token.refresh_token as string,
  expiresAt: token.token.expires_at as Date,
});

const getAndRefreshToken = async () => {
  const db = getDB();

  const existingToken = await db.oauthToken.findUnique({
    where: {
      id: OauthTokenType.Traewelling,
    },
  });

  if (!existingToken) {
    return null;
  }

  const { token, refreshed } = await refreshToken({
    access_token: existingToken.accessToken,
    refresh_token: existingToken.refreshToken,
    expires_at: existingToken.expiresAt,
  });

  if (!refreshed) {
    return existingToken;
  }

  const newTokenData = createDBTokenData(token);

  const newToken = await db.oauthToken.update({
    where: {
      id: OauthTokenType.Traewelling,
    },
    data: {
      ...newTokenData,
    },
  });

  return newToken;
};

traewellingHandler.get(
  '/status',
  zValidator('query', z.object({ redirectUri: z.string() })),
  async (ctx) => {
    const db = getDB();

    const token = await getAndRefreshToken();

    const user = token?.accessToken
      ? await new TraewellingClient(token.accessToken).user()
      : null;

    const authUrl = getAuthUrl(ctx.req.valid('query').redirectUri);

    return ctx.json({
      connected: !!token,
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

    try {
      const token = await getTokenFromCode(code, redirectUri);
      const tokenData = createDBTokenData(token);

      const savedToken = await db.oauthToken.upsert({
        where: {
          id: OauthTokenType.Traewelling,
        },
        create: tokenData,
        update: tokenData,
      });

      return ctx.json({
        savedToken,
      });
    } catch (err) {
      const error = err as Error;
      console.error(error);
      return ctx.json({ error: error.name, message: error.message }, 500);
    }
  }
);
