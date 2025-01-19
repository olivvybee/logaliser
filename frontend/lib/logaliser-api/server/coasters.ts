import { getServerSideCookie } from './getServerSideCookie';
import { makeRequest } from '../makeRequest';

export const getCountryList = async () => {
  const apiKey = await getServerSideCookie();

  return makeRequest<string[]>('/theme-parks/countries', apiKey);
};
