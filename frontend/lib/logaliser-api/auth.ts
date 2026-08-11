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

export const getTraewellingAuthStatus = async () => {
  const redirectUri = `${process.env.ORIGIN_URL}/callback/traewelling`;

  const params = new URLSearchParams({ redirectUri });

  return makeRequest<TraewellingAuthStatusResponse>(
    `/auth/traewelling/status?${params.toString()}`
  );
};
