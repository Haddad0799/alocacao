import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DeveloperProfileRepositoryPort } from '../../domain/port/developer-profile.repository.port';
import { DEVELOPER_PROFILE_REPOSITORY } from '../../domain/port/developer-profile.repository.port';
import { UpdateDeveloperProfileDto } from '../../presentation/dto/update-developer-profile.dto';
import { Seniority } from '../../domain/entity/developer-profile.entity';

@Injectable()
export class UpdateDeveloperProfileUseCase {
  constructor(
    @Inject(DEVELOPER_PROFILE_REPOSITORY)
    private readonly repo: DeveloperProfileRepositoryPort,
  ) {}

  async execute(userId: string, dto: UpdateDeveloperProfileDto) {
    const profile = await this.repo.findByUserId(userId);
    
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    profile.update(
        (dto.seniority as Seniority) ?? profile.seniority,
        dto.stack ?? profile.stack,
        dto.skills ?? profile.skills);


    return this.repo.save(profile);
  }
}