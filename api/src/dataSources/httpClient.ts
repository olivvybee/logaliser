import { USER_AGENT } from '../dataSources/dataSources.constants';
import { RequestError } from './apis.types';

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected static defaultHeaders: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': USER_AGENT,
  };

  protected get headers(): HeadersInit {
    return HttpClient.defaultHeaders;
  }

  protected async get<TData>(
    path: string,
    params?: Record<string, string>
  ): Promise<TData> {
    const normalisedPath = path.startsWith('/') ? path : `/${path}`;
    const searchParams = params
      ? '?' + new URLSearchParams(params).toString()
      : '';

    const url = `${this.baseUrl}${normalisedPath}${searchParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new RequestError(text, response.status);
    }

    const json = await response.json();
    return json as TData;
  }
}
