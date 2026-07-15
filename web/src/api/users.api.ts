import { api } from './client';
import type { CreateUserRequest, CreatedUser, Role } from '../types';

export const usersApi = {
  async create(role: Role, dados: CreateUserRequest): Promise<CreatedUser> {
    const rota =
      role === 'ADMIN' ? '/users/admins'
      : role === 'MANAGER' ? '/users/managers'
      : '/users/developers';

    const { data } = await api.post<CreatedUser>(rota, dados);
    return data;
  },
};