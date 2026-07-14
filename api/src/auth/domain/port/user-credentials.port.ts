// auth/domain/port/user-credentials.port.ts
export const USER_CREDENTIALS = Symbol('USER_CREDENTIALS');

export interface UserCredentials {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly role: string;
}

export interface UserCredentialsPort {
  findByEmail(email: string): Promise<UserCredentials | null>;
  findById(id: string): Promise<UserCredentials | null>;
}