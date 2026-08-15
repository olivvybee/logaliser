import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { getDB } from '../../db';
import { TraewellingClient } from '../../dataSources/traewelling/client';
import {
  getTraewellingToken,
  getAuthUrl,
  getTokenFromCode,
} from '../../dataSources/traewelling/auth';
import { OauthTokenType } from '../../dataSources/dataSources.types';
import { createDBTokenData } from '../../dataSources/utils';

export const traewellingHandler = new Hono();

traewellingHandler.get(
  '/status',
  zValidator('query', z.object({ redirectUri: z.string() })),
  async (ctx) => {
    const token = await getTraewellingToken();

    const user = token ? await new TraewellingClient(token).user() : null;

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
      const tokenData = createDBTokenData(OauthTokenType.Traewelling, token);

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
