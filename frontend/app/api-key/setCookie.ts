'use server';

import { cookies } from 'next/headers';
import { LOGALISER_API_KEY_COOKIE_NAME } from '../constants';

const COOKIE_EXPIRY_MS = 1000 * 86400 * 30; // 30 days

export const setCookie = async (value: string) => {
  const cookieStore = await cookies();
  cookieStore.set(LOGALISER_API_KEY_COOKIE_NAME, value, {
    expires: Date.now() + COOKIE_EXPIRY_MS,
  });
};
