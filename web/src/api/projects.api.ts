import { api } from './client';
import type { Project, CreateProjectRequest } from '../types';

export const projectsApi = {
  async create(data: CreateProjectRequest): Promise<Project> {
    const { data: result } = await api.post<Project>('/projects', data);
    return result;
  },

  async list(): Promise<Project[]> {
    const { data } = await api.get<Project[]>('/projects');
    return data;
  },
};