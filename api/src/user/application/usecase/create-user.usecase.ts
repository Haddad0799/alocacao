import { Injectable, Inject } from '@nestjs/common';
import { CreateUserCommand } from '../commands/create-user.command';
import { User } from '../../domain/entity/user';
import { EmailAlreadyInUseException } from '../../domain/exception/email-already-in-use.exception';
import { USER_REPOSITORY } from '../../domain/port/user.repository.port';
import type { UserRepositoryPort } from '../../domain/port/user.repository.port';
import { PASSWORD_HASHER } from '../../domain/port/password-hasher.port';
import type { PasswordHasherPort } from '../../domain/port/password-hasher.port';
import { Email } from '../../domain/valueobject/email';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const email = Email.of(command.email);

    if (await this.userRepository.findUserByEmail(email.value)) {
      throw new EmailAlreadyInUseException(email.value);
    }

    const user = User.create(
  command.name,
  email,
  await this.hasher.hash(command.password),
  command.role,
);

    return this.userRepository.saveUser(user);
  }
}