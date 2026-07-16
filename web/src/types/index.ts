export type Role = 'ADMIN' | 'MANAGER' | 'DEVELOPER';

export interface AuthUser {
  id: string;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const SENIORITY_OPTIONS = ['JUNIOR', 'PLENO', 'SENIOR'] as const;
export type Seniority = typeof SENIORITY_OPTIONS[number];

export interface Skill {
  _id?: string;
  name: string;
  level: number;
}

export interface DeveloperProfile {
  id: string;
  seniority: Seniority;
  stack: string[];
  skills: Skill[];
  available: boolean;
}

export interface CreateDeveloperProfileRequest {
  seniority: Seniority;
  stack: string[];
  skills: Skill[];
}

export interface UpdateDeveloperProfileRequest {
  seniority?: Seniority;
  stack?: string[];
  skills?: Skill[];
  available?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface Allocation {
  id: string;
  projectId: string;
  developerId: string;
  startDate: string;
  endDate: string;
}

export interface CreateAllocationRequest {
  projectId: string;
  developerId: string;
  startDate: string;
  endDate: string;
}

export interface DeveloperListItem {
  id: string;
  name: string;
  email: string;
  role: Role;
}