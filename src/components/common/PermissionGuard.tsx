import React from 'react';
import { usePermissions } from '@/hooks/use-permissions';

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Conditionally renders children based on user permissions.
 * Bypassed for SUPER_ADMIN and ADMIN.
 */
export function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, isAdmin } = usePermissions();

  if (isAdmin) {
    return <>{children}</>;
  }

  if (permission) {
    if (hasPermission(permission)) {
      return <>{children}</>;
    }
  }

  if (permissions && permissions.length > 0) {
    if (requireAll) {
      const { permissions: userPerms } = usePermissions();
      const hasAll = permissions.every((p) => userPerms.includes(p));
      if (hasAll) return <>{children}</>;
    } else {
      if (hasAnyPermission(permissions)) {
        return <>{children}</>;
      }
    }
  }

  return <>{fallback}</>;
}
