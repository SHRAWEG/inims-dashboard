import { Permission as ApiPermission, Role as ApiRole } from '@/lib/api/roles';

export type Permission = ApiPermission;
export type Role = ApiRole;

export interface RoleFormData {
  name: string;
  description: string;
  isActive: boolean;
  permissionIds: string[];
}
