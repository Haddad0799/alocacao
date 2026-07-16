import { Injectable, Inject } from '@nestjs/common';
import { DEVELOPER_PROFILE_REPOSITORY } from '../../domain/port/developer-profile.repository.port';
import type { DeveloperProfileRepositoryPort } from '../../domain/port/developer-profile.repository.port';
import { DeveloperProfile } from '../../domain/entity/developer-profile.entity';

@Injectable()
export class GetDeveloperProfileUseCase {
  constructor(
    @Inject(DEVELOPER_PROFILE_REPOSITORY)
    private readonly repo: DeveloperProfileRepositoryPort,
  ) {}

  async execute(userId: string): Promise<DeveloperProfile | null> {
    return await this.repo.findByUserId(userId);
  }
}