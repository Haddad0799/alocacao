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