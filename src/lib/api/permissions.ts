import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { Permission } from './roles';

export const permissionsApi = {
  findAll: async (): Promise<Permission[]> => {
    const res = await apiClient.get(ENDPOINTS.PERMISSIONS.BASE);
    return res.data.data;
  },
};
