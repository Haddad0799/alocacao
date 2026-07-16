// developer/application/usecase/create-developer-profile.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { DEVELOPER_PROFILE_REPOSITORY } from '../../domain/port/developer-profile.repository.port';
import type { DeveloperProfileRepositoryPort } from '../../domain/port/developer-profile.repository.port';
import { DeveloperProfile } from '../../domain/entity/developer-profile.entity';
import { CreateDeveloperProfileCommand } from '../commands/create-developer-profile.command';
import { ProfileAlreadyExistsException } from '../../domain/exception/profile-already-exists.exception';

@Injectable()
export class CreateDeveloperProfileUseCase {
  constructor(
    @Inject(DEVELOPER_PROFILE_REPOSITORY)
    private readonly repo: DeveloperProfileRepositoryPort,
  ) {}

  async execute(command: CreateDeveloperProfileCommand): Promise<DeveloperProfile> {
    const existing = await this.repo.findByUserId(command.userId);
    if (existing) {
      throw new ProfileAlreadyExistsException();
    }

    const profile = DeveloperProfile.create(
      command.userId,
      command.seniority,
      command.stack,
      command.skills,
    );

    return this.repo.save(profile);
  }
}