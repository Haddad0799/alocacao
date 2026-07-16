export class CreateAllocationCommand {
  constructor(
    readonly projectId: string,
    readonly developerId: string,
    readonly startDate: Date,
    readonly endDate: Date,
    readonly allocatedById: string,
  ) {}
}