import Cookies from 'js-cookie';

import { LOGALISER_API_KEY_COOKIE_NAME } from '@/constants';

export const getClientSideCookie = () =>
  Cookies.get(LOGALISER_API_KEY_COOKIE_NAME);
