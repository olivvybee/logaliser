import { AuthorizationCode, ModuleOptions, Token } from 'simple-oauth2';
import { config as loadEnv } from 'dotenv';
import { USER_AGENT } from '../dataSources.constants';
import { getDB } from '../../db';
import { OauthTokenType } from '../dataSources.types';
import { createDBTokenData } from '../utils';

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

const authClient = new AuthorizationCode(OAUTH_CONFIG);

export const getAuthUrl = (redirectUri: string) => {
  return authClient.authorizeURL({
    redirect_uri: redirectUri,
    scope: SCOPES,
  });
};

export const getTokenFromCode = async (code: string, redirectUri: string) => {
  return authClient.getToken(
    {
      code,
      redirect_uri: redirectUri,
      scope: SCOPES,
    },
    { json: true }
  );
};

export const refreshToken = async (oldToken: Token) => {
  const client = new AuthorizationCode(OAUTH_CONFIG);

  const token = client.createToken(oldToken);

  if (!token.expired()) {
    return { token, refreshed: false };
  }

  const refreshedToken = await token.refresh({ scope: SCOPES });

  return { token: refreshedToken, refreshed: true };
};

export const getTraewellingToken = async () => {
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

  const newTokenData = createDBTokenData(OauthTokenType.Traewelling, token);

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
