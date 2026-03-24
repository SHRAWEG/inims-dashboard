import { useAuth } from './use-auth';
import { SystemRole } from '@/types/auth.types';

export function usePermissions() {
  const { user } = useAuth();

  const isAdmin = 
    user?.systemRole === SystemRole.SUPER_ADMIN || 
    user?.systemRole === SystemRole.ADMIN;

  const hasPermission = (permission: string) => {
    if (isAdmin) return true;
    return user?.permissions.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: string[]) => {
    if (isAdmin) return true;
    return permissions.some((p) => user?.permissions.includes(p));
  };

  return {
    isAdmin,
    hasPermission,
    hasAnyPermission,
    permissions: user?.permissions ?? [],
    systemRole: user?.systemRole,
  };
}
