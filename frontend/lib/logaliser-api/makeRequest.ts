export class RequestError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const makeRequest = async (path: string, apiKey: string) => {
  const baseUrl = process.env.LOGALISER_API_URL;
  const normalisedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalisedPath}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new RequestError(text, response.status);
  }

  const json = await response.json();
  return json;
};
