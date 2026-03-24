import { z } from 'zod';
import { SystemRole } from '@/types/auth.types';

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  systemRole: z.nativeEnum(SystemRole).optional(),
  roleId: z.string().optional(),
}).refine(data => {
  // Can have systemRole OR roleId, but not both
  const hasSystemRole = !!data.systemRole;
  const hasRoleId = !!data.roleId;
  return (hasSystemRole && !hasRoleId) || (!hasSystemRole && hasRoleId);
}, {
  message: "Assign either a system role or a custom role, but not both",
  path: ['systemRole']
});

export type UserSchema = z.infer<typeof userSchema>;
