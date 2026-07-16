import { api } from './client';
import type {
  CreateDeveloperProfileRequest,
  DeveloperProfile,
  UpdateDeveloperProfileRequest,
} from '../types';

export const developersApi = {
  async createProfile(data: CreateDeveloperProfileRequest) {
    const response = await api.post<DeveloperProfile>(
      '/developers/me/profile',
      data,
    );

    return response.data;
  },

 async getProfile() {
  try {
    const response = await api.get<DeveloperProfile>('/developers/me/profile');
    return response.data;
  } catch (e: any) {
    if (e.response?.status === 404) return null;  
    throw e;                                       
  }
},

  async updateProfile(data: UpdateDeveloperProfileRequest) {
    const response = await api.patch<DeveloperProfile>(
      '/developers/me/profile',
      data,
    );

    return response.data;
  },
};