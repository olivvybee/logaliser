import { makeRequest } from './makeRequest';

interface AuthResult {
  valid: boolean;
}

export const checkApiKey = async (apiKey: string) => {
  try {
    const { valid } = await makeRequest<AuthResult>('/auth', apiKey);
    return !!valid;
  } catch (err) {
    return false;
  }
};
