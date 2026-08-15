import { OauthToken } from '../../__generated__/prisma/client';
import { HttpClient } from '../httpClient';
import { TraewellingUser } from './entities/User';

const BASE_URL = 'https://traewelling.de/api/v1';

export class TraewellingClient extends HttpClient {
  private accessToken: string | null;

  constructor(token: OauthToken) {
    super(BASE_URL);
    this.accessToken = token.accessToken;
  }

  protected get headers(): HeadersInit {
    return {
      ...HttpClient.defaultHeaders,
      Authorization: `Bearer ${this.accessToken}`,
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
