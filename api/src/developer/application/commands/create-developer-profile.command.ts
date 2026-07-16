import type { Seniority, Skill } from '../../domain/entity/developer-profile.entity';

export class CreateDeveloperProfileCommand {
  constructor(
    readonly userId: string,
    readonly seniority: Seniority,
    readonly stack: string[],
    readonly skills: Skill[],
  ) {}
}