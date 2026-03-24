import { z } from 'zod';
import { SystemRole } from '@/types/auth.types';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  systemRole: z.nativeEnum(SystemRole).nullable().optional(),
  roleId: z.string().uuid().nullable().optional(),
  isActive: z.boolean(),
}).refine(data => (data.systemRole && !data.roleId) || (!data.systemRole && data.roleId) || (!data.systemRole && !data.roleId), {
  message: "User must have either a System Role or a Custom Role, but not both.",
  path: ['systemRole']
});

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
