import { makeRequest } from './makeRequest';

export const checkApiKey = async (apiKey: string) => {
  try {
    const { valid } = await makeRequest('/auth', apiKey);
    return !!valid;
  } catch (err) {
    return false;
  }
};
