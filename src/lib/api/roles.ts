import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

export interface Permission {
  id: string;
  resource: string;
  action: string;
  category: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  permissions: Permission[];
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  isActive?: boolean;
  permissionIds: string[];
}

export type UpdateRoleDto = Partial<CreateRoleDto>;

export const rolesApi = {
  findAll: async (): Promise<Role[]> => {
    const res = await apiClient.get(ENDPOINTS.ROLES.BASE);
    return res.data.data;
  },

  findOne: async (id: string): Promise<Role> => {
    const res = await apiClient.get(ENDPOINTS.ROLES.BY_ID(id));
    return res.data.data;
  },

  create: async (data: CreateRoleDto): Promise<Role> => {
    const res = await apiClient.post(ENDPOINTS.ROLES.BASE, data);
    return res.data.data;
  },

  update: async (id: string, data: UpdateRoleDto): Promise<Role> => {
    const res = await apiClient.patch(ENDPOINTS.ROLES.BY_ID(id), data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.ROLES.BY_ID(id));
  },
};
