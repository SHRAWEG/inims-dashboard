# API Client

## Section 1 — Backend response contract

The backend always returns these exact shapes. Never assume anything else:

```ts
// src/types/api.types.ts

export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: number;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// LocalizedField — bilingual content from backend
export interface LocalizedField {
  en: string;
  ne: string;
}
```

## Section 2 — Axios instance

`src/lib/api/client.ts`:

```ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import { parseApiError } from '@/lib/utils/error';
import { refreshTokens } from '@/lib/auth/refresh';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(null));
  failedQueue = [];
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Unwrap ApiResponse<T> — all API functions receive T directly
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => response.data.data as any,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshTokens();
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(parseApiError(error));
  }
);
```

Note the failed queue pattern — if multiple requests fail with 401 simultaneously, only one refresh is attempted and all queued requests retry after.

## Section 3 — Error utility

`src/lib/utils/error.ts`:

```ts
import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api.types';
import type { UseFormSetError } from 'react-hook-form';

export interface AppError {
  message: string;
  code: number;
  details?: Record<string, string[]>;
}

export function parseApiError(error: AxiosError<ApiErrorResponse>): AppError {
  if (error.response?.data?.error) {
    return {
      message: error.response.data.error.message,
      code: error.response.data.error.code,
      details: error.response.data.error.details,
    };
  }
  if (error.code === 'ECONNABORTED') {
    return { message: 'Request timed out. Please try again.', code: 408 };
  }
  if (!error.response) {
    return { message: 'Network error. Check your connection.', code: 0 };
  }
  return { message: 'Something went wrong. Please try again.', code: 500 };
}

export function mapValidationErrors(
  details: Record<string, string[]>,
  setError: UseFormSetError<any>,
): void {
  Object.entries(details).forEach(([field, messages]) => {
    setError(field as any, { type: 'server', message: messages[0] });
  });
}
```

## Section 4 — Endpoints registry

`src/lib/api/endpoints.ts` — all strings here, never hardcoded elsewhere:

```ts
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/users/me',
    CHANGE_PASSWORD: '/users/me/change-password',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
    REACTIVATE: (id: string) => `/users/${id}/reactivate`,
    RESET_PASSWORD: (id: string) => `/users/${id}/reset-password`,
  },
  SECTORS: {
    BASE: '/sectors',
    BY_ID: (id: string) => `/sectors/${id}`,
  },
  // one section per domain
} as const;
```

## Section 5 — API function pattern

`src/lib/api/sectors.api.ts`:

```ts
import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { Sector, CreateSectorDto, UpdateSectorDto } from '@/types/sector.types';
import type { PaginatedResponse } from '@/types/api.types';
import type { SupportedLocale } from '@/types/i18n.types';

export interface GetSectorsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  locale?: SupportedLocale;
}

export const sectorsApi = {
  getAll: (params: GetSectorsParams): Promise<PaginatedResponse<Sector>> =>
    apiClient.get(ENDPOINTS.SECTORS.BASE, { params }),

  getById: (id: string, locale?: SupportedLocale): Promise<Sector> =>
    apiClient.get(ENDPOINTS.SECTORS.BY_ID(id), { params: { locale } }),

  getByIdWithTranslations: (id: string): Promise<SectorWithTranslations> =>
    apiClient.get(ENDPOINTS.SECTORS.BY_ID(id), {
      params: { withTranslations: true }
    }),

  create: (dto: CreateSectorDto): Promise<Sector> =>
    apiClient.post(ENDPOINTS.SECTORS.BASE, dto),

  update: (id: string, dto: UpdateSectorDto): Promise<Sector> =>
    apiClient.patch(ENDPOINTS.SECTORS.BY_ID(id), dto),

  delete: (id: string): Promise<void> =>
    apiClient.delete(ENDPOINTS.SECTORS.BY_ID(id)),
};
```

## Section 6 — Rules

- API functions are pure — no hooks, no state, no error handling, no UI logic
- All functions explicitly typed — no inferred return types
- Paginated endpoints always typed as `Promise<PaginatedResponse<T>>`
- Never call `apiClient` directly from components or hooks that aren't in `lib/api/`
- `ENDPOINTS` object is the only place URL strings live
