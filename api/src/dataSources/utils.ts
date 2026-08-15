import { AccessToken } from 'simple-oauth2';
import { OauthToken } from '../__generated__/prisma/client';
import { OauthTokenType } from '../dataSources/dataSources.types';

export const createDBTokenData = (
  type: OauthTokenType,
  token: AccessToken
): OauthToken => ({
  id: type,
  accessToken: token.token.access_token as string,
  refreshToken: token.token.refresh_token as string,
  expiresAt: token.token.expires_at as Date,
});
