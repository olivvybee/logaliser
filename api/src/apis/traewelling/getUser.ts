import { makeRequest } from './makeRequest';

interface TraewellingUser {
  id: string;
  username: string;
}

export const getUser = async (token: string) => {
  return makeRequest<TraewellingUser>('/auth/user', token);
};
