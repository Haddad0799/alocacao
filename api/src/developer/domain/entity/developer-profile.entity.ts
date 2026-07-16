export type Seniority = 'JUNIOR' | 'PLENO' | 'SENIOR';

export interface Skill {
  name: string;
  level: number;
}

export class DeveloperProfile {
  private constructor(
    public readonly id: string | undefined,
    public readonly userId: string,
    public readonly seniority: Seniority,
    public readonly stack: string[],
    public readonly skills: Skill[],
    public readonly available: boolean,
  ) {}

  static create(
    userId: string,
    seniority: Seniority,
    stack: string[],
    skills: Skill[],
  ): DeveloperProfile {
    if (!userId?.trim()) {
      throw new Error('userId is required');
    }
    return new DeveloperProfile(undefined, userId, seniority, stack, skills, true);
  }

  update(seniority: Seniority, stack: string[], skills: Skill[]) {
    (this as any).seniority = seniority;
    (this as any).stack = stack;
    (this as any).skills = skills;
  }

  static restore(
    id: string,
    userId: string,
    seniority: Seniority,
    stack: string[],
    skills: Skill[],
    available: boolean,
  ): DeveloperProfile {
    return new DeveloperProfile(id, userId, seniority, stack, skills, available);
  }
}