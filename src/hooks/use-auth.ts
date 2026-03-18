import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { User } from '@/types/auth.types';

export function useAuth() {
  const queryClient = useQueryClient();

  // Try to fetch the current user profile using the access_token automatically attached by apiClient
  const { data, isLoading, isError } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: User } | User>(ENDPOINTS.AUTH.ME);
      // Depending on standard API envelope
      return ('data' in res.data ? res.data.data : res.data) as User;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    queryClient.clear();
    window.location.href = '/login';
  };

  return {
    user: data || null,
    isLoading,
    isAuthenticated: !!data && !isError,
    logout,
  };
}
