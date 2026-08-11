import { makeRequest } from './makeRequest';

interface AuthResult {
  valid: boolean;
}

export const checkApiKey = async (apiKey: string) => {
  try {
    const { valid } = await makeRequest<AuthResult>('/auth', { apiKey });
    return !!valid;
  } catch (err) {
    return false;
  }
};

interface TraewellingAuthStatusResponse {
  authUrl: string;
}

const getRedirectUri = () => `${process.env.ORIGIN_URL}/callback/traewelling`;

export const getTraewellingAuthStatus = async () => {
  const redirectUri = getRedirectUri();

  const params = new URLSearchParams({ redirectUri });

  return makeRequest<TraewellingAuthStatusResponse>(
    `/auth/traewelling/status?${params.toString()}`
  );
};

interface TraewellingAuthTokenResponse {
  authToken: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
}

export const createTraewellingAuthToken = async (code: string) => {
  const redirectUri = getRedirectUri();

  return makeRequest<TraewellingAuthTokenResponse>('/auth/traewelling/code', {
    body: { code, redirectUri },
  });
};
