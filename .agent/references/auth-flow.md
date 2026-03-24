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

## Section 4 — Axios Interceptors

The `apiClient` uses interceptors to handle token attachment and automatic token refresh.

### Request Interceptor
Reads the `access_token` from cookies and attaches it as a Bearer token.

```ts
apiClient.interceptors.request.use((config) => {
  const token = getCookie('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor (Token Refresh)
Handles `401 Unauthorized` errors by attempting to refresh the token via `/api/auth/refresh`.

```ts
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post('/api/auth/refresh');
        if (refreshResponse.status === 200) {
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout and redirect
        if (typeof window !== 'undefined') {
          await axios.post('/api/auth/logout').catch(() => {});
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

## Section 5 — Middleware

`src/middleware.ts`:
(Remains largely the same, ensuring unauthorized users are redirected to login)

## Section 6 — Authentication Hook

`src/hooks/use-auth.ts`:
Provides user data, authentication status, and logout functionality.

```ts
export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => usersApi.getMe(),
    // ...
  });

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
      window.location.href = '/login'; // Force redirect anyway
    }
  };

  return { user, isLoading, isAuthenticated: !!user, logout };
}
```
