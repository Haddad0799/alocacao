import { api } from './client';
import type { CreatedUser, CreateUserRequest, DeveloperListItem, Role } from '../types';

export const usersApi = {
  async create(role: Role, dados: CreateUserRequest): Promise<CreatedUser> {
    const rota =
      role === 'ADMIN' ? '/users/admins'
      : role === 'MANAGER' ? '/users/managers'
      : '/users/developers';
    const { data } = await api.post<CreatedUser>(rota, dados);
    return data;
  },

  async listDevelopers(): Promise<DeveloperListItem[]> {
    const { data } = await api.get<DeveloperListItem[]>('/users/developers');
    return data;
  },
};