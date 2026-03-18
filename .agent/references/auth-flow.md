# Authentication Flow

## Section 1 — Token storage

Access token stored in httpOnly cookie `access_token` (15min expiry).
Refresh token stored in httpOnly cookie `refresh_token` (7 days expiry).
Never in localStorage, sessionStorage, or memory.
Cookies are set/cleared only by Next.js API routes — never from client-side code.

## Section 2 — Next.js API routes

`app/api/auth/login/route.ts`:
```ts
export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${process.env.API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const response = NextResponse.json({ success: true });
  response.cookies.set('access_token', data.data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15,
    path: '/',
  });
  response.cookies.set('refresh_token', data.data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return response;
}
```

`app/api/auth/logout/route.ts` — clears both cookies.
`app/api/auth/refresh/route.ts` — calls backend refresh, sets new access token cookie.

## Section 3 — Session helper

`src/lib/auth/session.ts`:
```ts
import { cookies } from 'next/headers';

export interface Session {
  accessToken: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  if (!accessToken) return null;
  return { accessToken };
}
```

## Section 4 — Axios request interceptor

Attach token from cookie on every request. Since cookies are httpOnly, the browser sends them automatically — the axios interceptor reads them via the Next.js API route, not directly:

```ts
apiClient.interceptors.request.use((config) => {
  // cookies are sent automatically by the browser
  // no manual token attachment needed for browser requests
  return config;
});
```

For server-side requests (Server Components, Route Handlers), pass the cookie header manually:

```ts
import { cookies } from 'next/headers';

export async function serverApiClient() {
  const cookieStore = cookies();
  return axios.create({
    baseURL: process.env.API_URL,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
}
```

## Section 5 — Middleware

`src/middleware.ts`:
```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login'];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.some(r => pathname.startsWith(r));

  if (!accessToken && !isPublicRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
```

## Section 6 — Current user hook

`src/hooks/use-auth.ts`:
```ts
export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => usersApi.getMe(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => fetch('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/login';
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
  };
}
```
