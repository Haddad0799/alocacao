import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/port/user.repository.port';
import type { UserRepositoryPort } from '../../domain/port/user.repository.port';
import { User } from '../../domain/entity/user';
import { Role } from '../../domain/valueobject/role';

@Injectable()
export class ListUsersByRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repo: UserRepositoryPort,
  ) {}

  async execute(role: Role): Promise<User[]> {
    return this.repo.findByRole(role);
  }
}