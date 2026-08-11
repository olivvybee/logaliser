import { getDB } from '../../db';
import { USER_AGENT } from '../../utils/userAgent';
import { RequestError } from '../apis.types';

const BASE_URL = 'https://traewelling.de/api/v1';

export const makeRequest = async <TData>(path: string, token: string) => {
  const normalisedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${BASE_URL}${normalisedPath}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new RequestError(text, response.status);
  }

  const json = await response.json();
  return json.data as TData;
};
