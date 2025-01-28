import { LOGALISER_API_KEY_COOKIE_NAME } from '@/constants';
import { cookies } from 'next/headers';

export const getApiKey = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(LOGALISER_API_KEY_COOKIE_NAME)?.value;
};
