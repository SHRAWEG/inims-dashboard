import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/api/auth'];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const pathname = request.nextUrl.pathname;

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  // 1. If user is authenticated and tries to access login, redirect to dashboard
  if (accessToken && isPublicRoute && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. If user is NOT authenticated (no access token)
  if (!accessToken && !isPublicRoute) {
    // If we have a refresh token, we allow the request to pass.
    // The client-side apiClient or useAuth hook will detect the mission access_token,
    // hit a 401 on their first API call, and trigger the /api/auth/refresh flow.
    // This prevents a jarring redirect to login when a refresh is possible.
    if (refreshToken) {
      return NextResponse.next();
    }

    // No tokens at all, redirect to login
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
