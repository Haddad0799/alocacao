import { DeveloperProfile } from '../../domain/entity/developer-profile.entity';

export const DEVELOPER_PROFILE_REPOSITORY = Symbol('DEVELOPER_PROFILE_REPOSITORY');

export interface DeveloperProfileRepositoryPort {
  save(profile: DeveloperProfile): Promise<DeveloperProfile>;
  findByUserId(userId: string): Promise<DeveloperProfile | null>;
}