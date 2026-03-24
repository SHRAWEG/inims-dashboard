import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { User, SystemRole } from '@/types/auth.types';

export interface CreateUserDto {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  systemRole?: SystemRole;
  roleId?: string;
  isActive?: boolean;
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {
  id: string;
}

export const usersApi = {
  getMe: async () => {
    const res = await apiClient.get(ENDPOINTS.AUTH.ME);
    return res.data.data as User;
  },

  findAll: async () => {
    const res = await apiClient.get(ENDPOINTS.USERS.BASE);
    return res.data.data as User[];
  },

  findOne: async (id: string) => {
    const res = await apiClient.get(ENDPOINTS.USERS.BY_ID(id));
    return res.data.data as User;
  },

  create: async (dto: CreateUserDto) => {
    const res = await apiClient.post(ENDPOINTS.USERS.BASE, dto);
    return res.data.data as User;
  },

  update: async (dto: UpdateUserDto) => {
    const { id, ...data } = dto;
    const res = await apiClient.patch(ENDPOINTS.USERS.BY_ID(id), data);
    return res.data.data as User;
  },
  
  delete: async (id: string) => {
    const res = await apiClient.delete(ENDPOINTS.USERS.BY_ID(id));
    return res.data;
  },
};
