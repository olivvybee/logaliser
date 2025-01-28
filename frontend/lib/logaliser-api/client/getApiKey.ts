import Cookies from 'js-cookie';

import { LOGALISER_API_KEY_COOKIE_NAME } from '@/constants';

export const getApiKey = () => Cookies.get(LOGALISER_API_KEY_COOKIE_NAME);
