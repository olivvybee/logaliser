import { RequestError } from '../apis.types';
import { HttpClient } from '../httpClient';
import { TraewellingUser } from './entities/User';

const BASE_URL = 'https://traewelling.de/api/v1';

export class TraewellingClient extends HttpClient {
  private token: string | undefined;

  constructor(accessToken: string) {
    super(BASE_URL);
    this.token = accessToken;
  }

  protected get headers(): HeadersInit {
    return {
      ...HttpClient.defaultHeaders,
      Authorization: `Bearer ${this.token}`,
    };
  }

  protected async get<TData>(
    path: string,
    params?: Record<string, string>
  ): Promise<TData> {
    const response = await super.get<{ data: TData }>(path, params);
    return response.data;
  }

  public async user(): Promise<TraewellingUser> {
    return this.get<TraewellingUser>('/auth/user');
  }
}
