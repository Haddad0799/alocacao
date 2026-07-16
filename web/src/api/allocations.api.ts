import { api } from './client';
import type { Allocation, CreateAllocationRequest } from '../types';

export const allocationsApi = {
  async create(data: CreateAllocationRequest): Promise<Allocation> {
    const { data: result } = await api.post<Allocation>('/allocations', data);
    return result;
  },

  async list(): Promise<Allocation[]> {
    const { data } = await api.get<Allocation[]>('/allocations');
    return data;
  },
};