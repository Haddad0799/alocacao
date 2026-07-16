export class Allocation {
  private constructor(
    public readonly id: string | undefined,
    public readonly projectId: string,
    public readonly developerId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly allocatedById: string,
  ) {}

  static create(
    projectId: string,
    developerId: string,
    startDate: Date,
    endDate: Date,
    allocatedById: string,
  ): Allocation {
    if (!projectId || !developerId) throw new Error('projectId and developerId are required');
    if (endDate <= startDate) throw new Error('endDate must be after startDate');
    return new Allocation(undefined, projectId, developerId, startDate, endDate, allocatedById);
  }

  static restore(
    id: string,
    projectId: string,
    developerId: string,
    startDate: Date,
    endDate: Date,
    allocatedById: string,
  ): Allocation {
    return new Allocation(id, projectId, developerId, startDate, endDate, allocatedById);
  }
}