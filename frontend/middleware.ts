import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
import { LOGALISER_API_KEY_COOKIE_NAME } from './constants';

export const middleware = (request: NextRequest) => {
  const cookie = request.cookies.get(LOGALISER_API_KEY_COOKIE_NAME);
  if (!cookie || !cookie.value) {
    const url = request.nextUrl.clone();
    url.pathname = '/api-key';
    return NextResponse.rewrite(url);
  }
};

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api-key
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico|api-key).*)',
  ],
};
