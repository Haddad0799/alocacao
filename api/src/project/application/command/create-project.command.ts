export class CreateProjectCommand {
  constructor(
    readonly name: string,
    readonly description: string | undefined,
    readonly createdById: string,
  ) {}
}