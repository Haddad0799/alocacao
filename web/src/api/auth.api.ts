import { api } from './client';
import type { AuthUser, LoginResponse } from '../types';

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return data;
  },

  async refresh(): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/refresh');
    return data;
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>('/users/me');
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }
};