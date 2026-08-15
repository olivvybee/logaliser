import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { getDB } from '../../db';
import { OauthToken } from '../../__generated__/prisma/client';

import { OauthTokenType } from './auth.types';
import { TraewellingClient } from '../../apis/traewelling/client';
import { getAuthUrl, getTokenFromCode } from '../../apis/traewelling/auth';

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

    const authUrl = getAuthUrl(ctx.req.valid('query').redirectUri);

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

    try {
      const token = await getTokenFromCode(code, redirectUri);

      const tokenData: OauthToken = {
        id: OauthTokenType.Traewelling,
        accessToken: token.token.access_token as string,
        refreshToken: token.token.refresh_token as string,
        expiresAt: token.token.expires_at as Date,
      };

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
