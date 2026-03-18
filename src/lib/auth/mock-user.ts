import { User, UserRole } from '@/types/auth.types';

export const MOCK_USER: User = {
  id: 'mock-user-id',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@inims.com',
  role: UserRole.SUPER_ADMIN,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
