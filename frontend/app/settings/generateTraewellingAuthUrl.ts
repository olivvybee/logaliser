import { AuthorizationCode } from 'simple-oauth2';

const SCOPES = ['read-search', 'write-statuses'];

export const generateTraewellingAuthUrl = () => {
  const client = new AuthorizationCode({
    auth: {
      tokenHost: 'https://traewelling.de',
    },
    client: {
      id: process.env.NEXT_PUBLIC_TRAEWELLING_CLIENT_ID || '',
      secret: process.env.NEXT_PUBLIC_TRAEWELLING_CLIENT_SECRET || '',
    },
  });

  const callbackOrigin = process.env.NEXT_PUBLIC_ORIGIN_URL;

  return client.authorizeURL({
    redirect_uri: `${callbackOrigin}/callback/traewelling`,
    scope: SCOPES,
  });
};
