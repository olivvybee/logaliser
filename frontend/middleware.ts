import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
import { LOGALISER_API_KEY_COOKIE_NAME } from './constants';

export const middleware = (request: NextRequest) => {
  const requestedPath = request.nextUrl.pathname;
  const cookie = request.cookies.get(LOGALISER_API_KEY_COOKIE_NAME);
  if (!cookie || !cookie.value) {
    const url = request.nextUrl.clone();
    url.pathname = `/api-key`;
    url.searchParams.set('requestedPath', requestedPath);
    return NextResponse.redirect(url);
  }
};

export const config: MiddlewareConfig = {
  matcher: ['/logalise/:path*'],
};
