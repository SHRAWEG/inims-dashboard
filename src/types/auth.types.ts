export enum SystemRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  systemRole: SystemRole | null;
  roleId: string | null;
  roleName: string | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}
