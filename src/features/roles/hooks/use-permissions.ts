import { useQuery } from '@tanstack/react-query';
import { permissionsApi } from '@/lib/api/permissions';

export const permissionKeys = {
  all: ['permissions'] as const,
};

export function useAllPermissions() {
  return useQuery({
    queryKey: permissionKeys.all,
    queryFn: permissionsApi.findAll,
    staleTime: Infinity, // Permissions rarely change
  });
}
