import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { User } from '@/types/auth.types';

export function useAuth() {
  const queryClient = useQueryClient();

  // Try to fetch the current user profile using the access_token automatically attached by apiClient
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const res = await apiClient.get<any>(ENDPOINTS.AUTH.ME);
      
      // Handle the various ways backends might wrap the user data
      // Typical: { success: true, data: { ...userFields } } OR { success: true, data: { user: { ...userFields } } }
      const dataObj = res.data;
      const user = dataObj?.data?.user || dataObj?.data || dataObj?.user || dataObj;
      
      if (typeof window !== 'undefined' && user?.id) {
        localStorage.setItem('inims-user-presumed', JSON.stringify(user));
      }
      
      return user as User;
    },
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Optimistic UI: Use presumed user from localStorage if query is loading
  const presumedUser = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('inims-user-presumed') || 'null') as User | null
    : null;

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('inims-user-presumed');
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    queryClient.clear();
    window.location.href = '/login';
  };

  return {
    user: data || presumedUser,
    isLoading: isLoading && !presumedUser, // Only "really" loading if we don't even have a presumed user
    isInitialLoading: isLoading,
    isError,
    status,
    isAuthenticated: !!(data || presumedUser),
    logout,
  };
}
