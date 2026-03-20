export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  message: string;
  meta: PaginationMeta;
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

import { LocalizedField } from './i18n.types';

export interface MasterRecord {
  id: string;
  name: LocalizedField | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MsnpIndicatorRecord {
  id: string;
  code: LocalizedField | string;
  name: LocalizedField | string;
  description?: LocalizedField | string;
  sectorId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
