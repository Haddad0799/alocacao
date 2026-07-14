import { Role } from '../../domain/valueobject/role';

export class CreateUserCommand {
  constructor(
    readonly name: string,
    readonly email: string,
    readonly password: string,
    readonly role: Role,
  ) {}
}