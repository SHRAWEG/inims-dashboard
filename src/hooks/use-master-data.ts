import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useLocale } from './use-locale';
import { PaginatedResponse, ApiResponse } from '@/types/api.types';

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useMasterData<T>(moduleEndpoint: string, params: QueryParams = {}) {
  const { locale } = useLocale();
  const queryClient = useQueryClient();

  const queryKey = [moduleEndpoint, locale, params];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<T>>(moduleEndpoint, {
        params: {
          ...params,
          locale, // Automatically append the locale param
        },
      });
      return res.data; // This returns the PaginatedResponse<T> payload
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<T>) => {
      const res = await apiClient.post<ApiResponse<T>>(moduleEndpoint, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [moduleEndpoint] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
      const res = await apiClient.patch<ApiResponse<T>>(`${moduleEndpoint}/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [moduleEndpoint] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete<ApiResponse<null>>(`${moduleEndpoint}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [moduleEndpoint] });
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
