import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isActive: z.boolean(),
  permissionIds: z.array(z.string()).min(1, 'Select at least one permission'),
});

export type RoleSchema = z.infer<typeof roleSchema>;
