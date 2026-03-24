import { User, SystemRole } from '@/types/auth.types';

export const MOCK_USER: User = {
  id: 'mock-user-id',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@inims.com',
  systemRole: SystemRole.SUPER_ADMIN,
  roleId: null,
  roleName: 'Super Admin',
  isActive: true,
  permissions: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
