import { Email } from '../valueobject/email';
import { Role } from '../valueobject/role';

export class User {
  private constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly email: Email,
    public readonly passwordHash: string,
    public readonly role: Role,
  ) {}

  static create(
    name: string,
    email: Email,
    passwordHash: string,
    role: Role,
  ): User {
    if (!name?.trim()) {
      throw new Error('Name is required');
    }
    return new User(undefined, name.trim(), email, passwordHash, role);
  }

  static restore(
    id: string,
    name: string,
    email: Email,
    passwordHash: string,
    role: Role,
  ): User {
    return new User(id, name, email, passwordHash, role);
  }
}