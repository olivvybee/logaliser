import Cookies from 'js-cookie';

import { LOGALISER_API_KEY_COOKIE_NAME } from '@/constants';

export class RequestError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

interface MakeRequestOptions {
  body?: unknown;
  apiKey?: string;
}

export const makeRequest = async <TData>(
  path: string,
  options: MakeRequestOptions = {}
) => {
  const baseUrl = process.env.NEXT_PUBLIC_LOGALISER_API_URL;
  const normalisedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalisedPath}`;

  const apiKey = options.apiKey || Cookies.get(LOGALISER_API_KEY_COOKIE_NAME);

  const { body } = options;

  const response = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${apiKey || 'not-set'}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new RequestError(text, response.status);
  }

  const json = await response.json();
  return json as TData;
};
