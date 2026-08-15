import { AuthorizationCode, ModuleOptions } from 'simple-oauth2';
import { config as loadEnv } from 'dotenv';
import { USER_AGENT } from '../apis.constants';

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
