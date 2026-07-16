
export class DeveloperProfileResponseDto {
  constructor(
    public readonly id: string,
    public readonly seniority: string,
    public readonly stack: string[],
    public readonly skills: { name: string; level: number }[],
    public readonly available: boolean,
  ) {}
}